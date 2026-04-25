/**
 * carveTopCSG — boolean-subtract shallow grooves from the case body.
 *
 * Approach: compute cutout volumes (box brushes) in world space aligned to
 * the mount-edge surface, then run three-bvh-csg SUBTRACTION against the
 * already-extruded case body geometry. Result: ONE mesh with cavities
 * baked into it — no plate-on-top, no z-fighting.
 *
 * Two cutout modes:
 *   - "plate": one switch-sized cavity per key (cap minus uniform border)
 *   - "tray":  one rectangular cavity per group (cluster bbox + borderWidth)
 *
 * Grouping (tray-only):
 *   - "all":         single bbox around every key
 *   - "per-row":     adjacency-clustered Y bands → bbox per row
 *   - "per-cluster": connected components in XY → bbox per cluster
 *
 * Wedge support: every subtractor is oriented to the mount-edge plane via
 * a 4×4 matrix (X stays world X; local Y = outward normal Nout; local Z =
 * tangent T from front to back). For flat profiles this collapses to a
 * straight axis-aligned box. For tilted profiles the box rotates with the
 * surface so the cut depth is uniform across the slope.
 */

import * as THREE from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { mergeVertices, mergeBufferGeometries } from "three-stdlib";

const ADJACENCY_GAP = 0.5;   // u — keys closer than this count as same cluster
const ROW_GAP       = 0.5;   // u — y values closer than this count as same row

// ─── Clustering ───────────────────────────────────────────────────────

/** Group keys by row using gap-based 1D clustering on key.y. */
const clusterByRow = (keys) => {
  const sorted = [...keys].sort((a, b) => a.y - b.y);
  const rows = [];
  let current = [];
  let lastY = -Infinity;
  for (const k of sorted) {
    if (k.y - lastY > ROW_GAP && current.length > 0) {
      rows.push(current);
      current = [];
    }
    current.push(k);
    lastY = Math.max(lastY, k.y);
  }
  if (current.length) rows.push(current);
  return rows;
};

/** Union-find: cluster keys whose bboxes are within ADJACENCY_GAP of each other. */
const clusterByAdjacency = (keys) => {
  const n = keys.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (i) => parent[i] === i ? i : (parent[i] = find(parent[i]));
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };

  const bbox = (k) => ({
    minX: k.x, maxX: k.x + (k.w || 1),
    minY: k.y, maxY: k.y + (k.h || 1),
  });
  const gap = (a, b) => {
    const ba = bbox(a), bb = bbox(b);
    const gx = Math.max(0, Math.max(ba.minX - bb.maxX, bb.minX - ba.maxX));
    const gy = Math.max(0, Math.max(ba.minY - bb.maxY, bb.minY - ba.maxY));
    return Math.hypot(gx, gy);
  };

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (gap(keys[i], keys[j]) <= ADJACENCY_GAP) union(i, j);
    }
  }
  const groups = new Map();
  for (let i = 0; i < n; i++) {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(keys[i]);
  }
  return [...groups.values()];
};

// ─── Cutout generation (in keyfield-local coords) ─────────────────────

const bboxOf = (cluster) => {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const k of cluster) {
    minX = Math.min(minX, k.x);
    maxX = Math.max(maxX, k.x + (k.w || 1));
    minY = Math.min(minY, k.y);
    maxY = Math.max(maxY, k.y + (k.h || 1));
  }
  return { minX, maxX, minY, maxY };
};

/**
 * Compute cutouts in world coordinates.
 * Each cutout = { cx, cz, w, d } — center + size in world XZ plane.
 *
 * @param {Array} keys
 * @param {{width:number,height:number}} bounds   — keyfield bbox
 * @param {{x:number,z:number}} mountOffset
 * @param {Object} topFrame
 */
function buildCutouts(keys, bounds, mountOffset, topFrame) {
  const cx0 = bounds.width / 2;
  const cz0 = bounds.height / 2;
  const offX = mountOffset.x || 0;
  const offZ = mountOffset.z || 0;

  if (topFrame.cutoutMode === "plate") {
    // switchHoleSize is now interpreted as a SCALE on the key footprint
    // (>1.0 = hole bigger than key, exposing visible plate around the
    // cap from above; <1.0 = hole smaller than key, hidden by cap).
    // Default 1.05 = hole 5% larger than key, leaving a clean rim of
    // recessed plate visible around each cap.
    const scale = topFrame.switchHoleSize ?? 1.05;
    return keys.map((k) => ({
      cx: (k.x + (k.w || 1) / 2) - cx0 + offX,
      cz: (k.y + (k.h || 1) / 2) - cz0 + offZ,
      w:  Math.max(0.05, (k.w || 1) * scale),
      d:  Math.max(0.05, (k.h || 1) * scale),
    }));
  }

  // tray mode — group then take bbox + borderWidth per cluster
  const grouping = topFrame.grouping || "all";
  const border = topFrame.borderWidth ?? 0.2;
  let clusters;
  if (grouping === "per-row")     clusters = clusterByRow(keys);
  else if (grouping === "per-cluster") clusters = clusterByAdjacency(keys);
  else                            clusters = [keys];

  return clusters.map((cluster) => {
    const b = bboxOf(cluster);
    return {
      cx: (b.minX + b.maxX) / 2 - cx0 + offX,
      cz: (b.minY + b.maxY) / 2 - cz0 + offZ,
      w:  (b.maxX - b.minX) + 2 * border,
      d:  (b.maxY - b.minY) + 2 * border,
    };
  });
}

// ─── Mount-edge plane frame ────────────────────────────────────────────

/**
 * Compute the plane frame at the mount edge — basis vectors + origin —
 * used to orient subtractor boxes onto the mount surface.
 *
 * Returns:
 *   - tangent T: unit vector front → back (in YZ plane)
 *   - outward normal Nout: perpendicular to T in YZ, pointing OUT of case
 *   - front: world-space front edge anchor (X is irrelevant; Y/Z anchor)
 *
 * Axis mapping for a subtractor's local frame:
 *   local.x → world.x        (cutout u axis)
 *   local.y → world Nout     (positive = above mount surface)
 *   local.z → world T        (positive = back direction)
 */
function mountEdgeFrame(profilePoints, mountEdge, depth, maxHeight) {
  const maxPX = Math.max(...profilePoints.map((p) => p.x)) || 1;
  const maxPY = Math.max(...profilePoints.map((p) => p.y)) || 1;
  const scaleZ = depth / maxPX;
  const scaleY = maxHeight / maxPY;

  let a = profilePoints[mountEdge[0]];
  let b = profilePoints[mountEdge[1]];
  // front = lower profile.x = HIGHER world.z (depth/2 − x*scaleZ)
  if (a.x > b.x) { const t = a; a = b; b = t; }
  const front = { y: a.y * scaleY, z: depth / 2 - a.x * scaleZ };
  const back  = { y: b.y * scaleY, z: depth / 2 - b.x * scaleZ };

  const dy = back.y - front.y;
  const dz = back.z - front.z;     // negative (going back = -z)
  const L = Math.hypot(dy, dz);
  if (L < 0.001) return null;
  const T_y = dy / L, T_z = dz / L;
  // Outward normal: rotate T by +90° in YZ (CCW when looking from +X):
  //   (T_y, T_z) → (-T_z, T_y). For flat T=(0,-1) → Nout=(1,0) (up). ✓
  const Nout_y = -T_z, Nout_z = T_y;

  return { front, back, T_y, T_z, Nout_y, Nout_z, length: L };
}

// ─── Subtractor brushes ────────────────────────────────────────────────

/**
 * Build a subtractor Brush for one cutout. Box dimensions match the
 * cutout's world XZ size; height = cutDepth + a small overlap ε so the
 * top face protrudes slightly above the mount surface (avoids near-zero
 * coplanar faces in CSG, which can leave thin caps).
 */
function buildCutoutGeo({ cutout, frame, cutDepth, mountOffsetY }) {
  // Larger eps so the box's top face is CLEARLY above the mount edge
  // surface — coplanar faces (eps=0.002) confuse the CSG/BVH and can
  // cause the cut to silently no-op (box treated as fully inside case).
  const eps = 0.05;
  // Local box: (w × (cutDepth + eps) × d), centered on local origin.
  // Local +y = outward normal direction. Translate so the box's TOP face
  // (local +y of cutDepth/2 + eps/2 → 0) lands on the mount surface, and
  // bottom face (local -y of cutDepth/2 + eps/2 → -cutDepth - eps) lands
  // cutDepth deep into the case. The eps overlap above the mount surface
  // prevents thin coplanar caps in the CSG output.
  const geo = new THREE.BoxGeometry(cutout.w, cutDepth + eps, cutout.d);
  geo.translate(0, -cutDepth / 2 + eps / 2, 0);

  // Project cutout's world (cx, cz) onto plane: u = cx (local x = world x),
  // v = arc length along edge from front.
  const u = cutout.cx;
  const v = (cutout.cz - frame.front.z) / frame.T_z;

  // Plane-to-world matrix in one shot — translation column already
  // includes the (u, 0, v) plane-space offset projected through the basis,
  // so we don't need a follow-up translate.
  const px = u;
  const py = frame.front.y + mountOffsetY + v * frame.T_y;
  const pz = frame.front.z                + v * frame.T_z;
  const m = new THREE.Matrix4().set(
    1, 0,             0,         px,
    0, frame.Nout_y,  frame.T_y, py,
    0, frame.Nout_z,  frame.T_z, pz,
    0, 0,             0,         1,
  );
  geo.applyMatrix4(m);
  geo.computeVertexNormals();
  return geo;
}

// ─── Public API ────────────────────────────────────────────────────────

/**
 * Carve shallow grooves into the case body via CSG subtraction.
 *
 * @param {THREE.BufferGeometry} caseGeo   — output of extrudeCaseProfile
 * @param {Object} caseProfile             — the eletypes-caseProfile/1 doc
 * @param {Array} keys                     — resolved layout keys
 * @param {{width:number,height:number}} bounds
 * @param {number} caseW
 * @param {number} caseD
 * @param {number} extrudeWidth
 * @param {{x?:number,y?:number,z?:number}} mountOffset
 * @returns {THREE.BufferGeometry|null}    — carved case geometry, or null on failure
 */
export function carveCaseTop({
  caseGeo, caseProfile, keys, bounds,
  caseD, extrudeWidth, mountOffset = {},
}) {
  const tf = caseProfile?.topFrame;
  if (!tf || !caseProfile?.points || !caseProfile?.mountEdge) return null;
  if (keys.length === 0) return null;

  const cutDepth = Math.max(0.01, tf.cutDepth ?? 0.1);

  // Re-derive maxHeight the same way KeyboardModel.profileScale does, so
  // the mount-edge frame matches the case body geometry exactly.
  const maxPY = Math.max(...caseProfile.points.map((p) => p.y)) || 1;
  const maxHeight = (maxPY / 60) * 2.0;

  const frame = mountEdgeFrame(
    caseProfile.points,
    caseProfile.mountEdge,
    caseD,
    maxHeight,
  );
  if (!frame) return null;

  const cutouts = buildCutouts(keys, bounds, mountOffset, tf);
  if (cutouts.length === 0) return null;

  const evaluator = new Evaluator();
  // three-bvh-csg needs BOTH inputs to:
  //  (1) expose the SAME attribute set (copies attribs through the op).
  //      BoxGeometry has position+normal+uv; extrudeCaseProfile only emits
  //      position — without padding uv we'd crash on .array undefined.
  //  (2) be MANIFOLD (or close to it). extrudeCaseProfile emits each
  //      face with its OWN unmerged vertex set, so adjacent faces have
  //      duplicated coincident verts at edges — non-manifold for the
  //      BVH, which then reads null normals on shared edges and crashes
  //      with "Cannot read properties of null (reading 'dot')".
  // mergeVertices welds duplicates by position+normal+uv equality, so we
  // pad uv first, recompute normals, THEN merge.
  // Strategy:
  //   1. Clone case geometry, KEEP only `position` (drop normal/uv).
  //   2. mergeVertices by position only — adjacent faces sharing an edge
  //      now collapse to shared verts (they had the same position but
  //      different per-face normals, which blocked the merge before).
  //   3. Re-add a dummy uv (CSG copies attribs through the op, both
  //      inputs need matching attribute set) and recompute smooth normals.
  let padded = new THREE.BufferGeometry();
  padded.setIndex(caseGeo.index);
  padded.setAttribute("position", caseGeo.attributes.position.clone());
  try {
    padded = mergeVertices(padded, 1e-4);
  } catch (e) {
    // mergeVertices may throw on geometry without indices; carry on.
  }
  const posCount = padded.attributes.position.count;
  padded.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(posCount * 2), 2));
  padded.computeVertexNormals();

  try {
    const subGeos = cutouts.map((c) => buildCutoutGeo({
      cutout: c,
      frame,
      cutDepth,
      mountOffsetY: mountOffset.y || 0,
    }));
    const subMerged = subGeos.length === 1
      ? subGeos[0]
      : mergeBufferGeometries(subGeos);
    if (!subMerged) return null;

    // Brushes need a material reference so three-bvh-csg's useGroups path
    // tags result.geometry groups with materialIndex 0 (case) vs 1 (cutout
    // interior). Actual rendering material comes from KeyboardModel via
    // <mesh material={[caseMat, plateMat]} />.
    const tagA = new THREE.MeshBasicMaterial();
    const tagB = new THREE.MeshBasicMaterial();
    const caseBrush = new Brush(padded, tagA);
    caseBrush.updateMatrixWorld();
    const subBrush = new Brush(subMerged, tagB);
    subBrush.updateMatrixWorld();
    evaluator.useGroups = true;
    const result = evaluator.evaluate(caseBrush, subBrush, SUBTRACTION);
    const out = result.geometry.clone();
    if (!out.attributes.position || out.attributes.position.count === 0) {
      console.warn("[carveTopCSG] empty result, falling back");
      return null;
    }
    out.computeVertexNormals();
    out.computeBoundingBox();
    out.computeBoundingSphere();
    return out;
  } catch (err) {
    console.warn("[carveTopCSG] CSG failed:", err);
    return null;
  }
}
