/**
 * KeyboardModel — 3D keyboard renderer driven by BoardLayout + ShellProfile data.
 *
 * Accepts any valid BoardLayout and optional ShellProfile as props.
 * The same JSON that drives the 2D editor also drives this 3D renderer.
 */

import React, {
  useRef,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { computeBounds, buildKeyIndex, isAccentKey, extractKeys, parseLegendPosition } from "./schema/derive";
import { DEFAULT_SHELL } from "./schema/shellProfile";
import { createKeycapFromSpec } from "./KeycapGeometry";
import { extrudeCaseProfile, computeMountSurface, extrudeEdgeStrip } from "./CaseEditor/extrudeProfile";
import { carveCaseTop } from "./CaseEditor/carveTopCSG";
import { resolveRenderStyle } from "./schema/types/renderStyle";
import { Text } from "@react-three/drei";

extend({ RoundedBoxGeometry });

// Map the CSS font-family values stored in legendPreset.style.fontFamily to
// actual TTF URLs that troika-three-text can load. The default troika font
// (Roboto subset) lacks arrows (↑↓←→) and Apple glyphs (⌘ ⌥ ⇧ ⌫), so layouts
// like HHKB and any keyboard with arrow keys rendered as .notdef squares.
// DejaVu covers Latin, arrows, box drawing, and the Apple command symbols.
const FONT_URL_MAP = {
  "Arial, sans-serif":          "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf",
  "Courier New, monospace":     "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSansMono.ttf",
  "Tomorrow, monospace":        "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSerif.ttf",
  "Helvetica Neue, Arial, sans-serif": "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf",
  "Courier New, Courier, monospace":   "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSansMono.ttf",
  "Tomorrow, Consolas, monospace":     "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSerif.ttf",
};
const DEFAULT_FONT_URL = "https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf";
const resolveFontUrl = (family) => FONT_URL_MAP[family] || DEFAULT_FONT_URL;

// ─── Animation tuning ───
const STIFFNESS = 600;
const DAMPING = 50;
const PRESS_DEPTH = 0.18;
const SETTLE_THRESHOLD = 0.0005;
const MAX_DELTA = 0.04;

// ─── Geometry tuning ───
const KEY_GAP = 0.08;
const KEY_HEIGHT = 0.38;
const KEY_BEVEL = 0.06;
const KEY_SEGMENTS = 2;
const PLATE_Y = 0.02;

// Row detection from Y position (matches normalization layer)
const yToRow = (y) => {
  if (y < 1.0) return 0;
  if (y < 2.0) return 1;
  if (y < 3.0) return 2;
  if (y < 4.0) return 3;
  if (y < 5.0) return 4;
  return 5;
};

const DEFAULT_OPACITY = { keycap: 1.0, accent: 1.0, case: 1.0, legend: 1.0 };

const KeyboardModel = forwardRef(({
  layout,          // BoardLayout object (or just the keys array for backwards compat)
  shell,           // Optional ShellProfile
  keycapPreset,    // Optional KeycapPreset — drives per-row sculpting
  keycapColor,
  accentKeyColor,
  caseColor,
  opacity: opacityProp,
  legendPreset,
  caseProfile,
  caseScale = 1.0,
  mountOffset = { x: 0, y: 0, z: 0 },
  mountFit = 0.85,
  extrudeWidth = 1.0,
  renderStyle,      // eletypes-renderStyle/1 — keycap scope; default PBR
  renderStyleCase,  // eletypes-renderStyle/1 — case/plate/edges scope; falls
                    //   back to renderStyle when unset
}, ref) => {
  const opacity = { ...DEFAULT_OPACITY, ...opacityProp };
  const regularMeshRef = useRef();
  const accentMeshRef = useRef();
  const { invalidate } = useThree();

  // ─── Normalize inputs (handles full preset, { keys }, or raw array) ───
  const keys = useMemo(() => extractKeys(layout), [layout]);
  const shellConfig = shell?.case || DEFAULT_SHELL.case;
  const plateConfig = shell?.plate || DEFAULT_SHELL.plate;

  const keyCount = keys.length;
  const bounds = useMemo(() => computeBounds(keys), [keys]);
  const keyIndex = useMemo(() => buildKeyIndex(keys), [keys]);

  const centerX = bounds.width / 2;
  const centerZ = bounds.height / 2;

  // ─── Split keys into regular / accent groups ───
  const { regularIndices, accentIndices, meshMap } = useMemo(() => {
    const reg = [];
    const acc = [];
    const map = new Array(keyCount); // map[globalIndex] → { ref: 'regular'|'accent', instanceIndex }
    for (let i = 0; i < keyCount; i++) {
      if (isAccentKey(keys[i])) {
        map[i] = { group: "accent", idx: acc.length };
        acc.push(i);
      } else {
        map[i] = { group: "regular", idx: reg.length };
        reg.push(i);
      }
    }
    return { regularIndices: reg, accentIndices: acc, meshMap: map };
  }, [keys, keyCount]);

  // ─── Animation state ───
  const offsets = useRef(new Float32Array(keyCount));
  const velocities = useRef(new Float32Array(keyCount));
  const activeSet = useRef(new Set());
  // Refs to each legend's group so the press animation can translate the label
  // along with the keycap. Without this, labels stay at their baseline Y while
  // the keycap springs down/up, which looks like the legend detaches from the cap.
  const labelGroupRefs = useRef([]);
  const labelBaselineY = useRef(new Float32Array(keyCount));

  // Reset animation state when layout changes
  useEffect(() => {
    offsets.current = new Float32Array(keyCount);
    velocities.current = new Float32Array(keyCount);
    activeSet.current.clear();
    labelBaselineY.current = new Float32Array(keyCount);
    labelGroupRefs.current.length = keyCount;
  }, [keyCount]);

  // ─── Pre-allocated objects ───
  const _mat4 = useMemo(() => new THREE.Matrix4(), []);
  const _pos = useMemo(() => new THREE.Vector3(), []);
  const _quat = useMemo(() => new THREE.Quaternion(), []);
  const _scale = useMemo(() => new THREE.Vector3(), []);

  // ─── Case dimensions (needed before rest positions for slope calc) ───
  // Case dimensions — scaled by caseScale for user adjustment
  const caseW = (bounds.width + shellConfig.paddingLeft + shellConfig.paddingRight) * caseScale;
  const caseD = (bounds.height + shellConfig.paddingTop + shellConfig.paddingBottom) * caseScale;
  const caseCenterZ = (shellConfig.paddingTop - shellConfig.paddingBottom) / 2 * caseScale;

  // ─── Shared profile scaling (used by BOTH case geo and mount surface) ───
  const profileScale = useMemo(() => {
    if (!caseProfile?.points || caseProfile.points.length < 3) return null;
    const maxPY = Math.max(...caseProfile.points.map(p => p.y)) || 1;
    return {
      maxHeight: (maxPY / 60) * 2.0,
      points: caseProfile.points,
      mountEdge: caseProfile.mountEdge,
    };
  }, [caseProfile]);

  // ─── Profile-based case geometry ───
  // When caseProfile.topFrame is set, run CSG subtraction to bake the
  // cutouts directly into the case body — single mesh, no plate-on-top.
  // CSG is expensive (~50–200ms for 80 keys), but only runs when layout
  // / profile / topFrame change (memoised).
  const profileCaseGeo = useMemo(() => {
    if (!profileScale) return null;
    const base = extrudeCaseProfile(
      profileScale.points,
      caseW * extrudeWidth,
      caseD,
      profileScale.maxHeight,
    );
    if (!caseProfile?.topFrame) return base;
    const carved = carveCaseTop({
      caseGeo: base,
      caseProfile,
      keys,
      bounds,
      caseD,
      extrudeWidth,
      mountOffset,
    });
    return carved || base;
  }, [profileScale, caseW, caseD, extrudeWidth, caseProfile, keys, bounds, mountOffset]);

  // ─── Colored edge strip geometries ───
  const edgeStrips = useMemo(() => {
    if (!profileScale || !caseProfile?.coloredEdges?.length) return [];
    return caseProfile.coloredEdges.map((edge) => ({
      geo: extrudeEdgeStrip(profileScale.points, edge.from, edge.to, caseW * extrudeWidth, caseD, profileScale.maxHeight),
      color: edge.color,
      emissive: edge.emissive ?? 0.5,
    }));
  }, [profileScale, caseProfile?.coloredEdges, caseW, caseD, extrudeWidth]);

  // ─── Mount surface from profile (same scaling as case geometry) ───
  const mountSurface = useMemo(() => {
    if (!profileScale || !profileScale.mountEdge) return null;
    const ms = computeMountSurface(profileScale.points, profileScale.mountEdge, caseD, profileScale.maxHeight);

    // mountFit: what proportion of the mount edge the key field occupies
    // 1.0 = keys span the full mount edge
    // 0.8 = keys occupy 80% of the edge, centered
    // >1.0 = keys extend beyond the edge (overflow)
    const margin = (1 - mountFit) / 2; // margin on each side

    return {
      ...ms,
      getY: (keyZ) => {
        // Map key Z range: +centerZ (front, low) → t=0, -centerZ (back, high) → t=1
        const keyRange = centerZ * 2;
        const rawT = keyRange !== 0 ? (centerZ - keyZ) / keyRange : 0.5;
        const t = margin + rawT * mountFit;
        const clampedT = Math.max(0, Math.min(1, t));
        return ms.startY + clampedT * (ms.endY - ms.startY) + (mountOffset.y || 0);
      },
    };
  }, [profileScale, caseD, centerZ, mountFit, mountOffset]);

  // ─── Rest positions (keys mount on the case surface) ───
  const restPositions = useMemo(() => {
    const profile = keycapPreset?.profile;
    const rowsData = (!profile?.uniform && profile?.rows) ? profile.rows : null;
    const baseH = profile?.defaultCap?.height || KEY_HEIGHT;

    const hd = caseD / 2;

    return keys.map((key) => {
      const row = yToRow(key.y);
      const sculpt = rowsData?.[row];
      const capH = sculpt ? baseH * sculpt.height : baseH;

      const x = (key.x + key.w / 2) - centerX + (mountOffset.x || 0);
      const z = (key.y + (key.h || 1) / 2) - centerZ + (mountOffset.z || 0);

      // Compute surface Y at this key's Z position (before X/Z offset for slope calc)
      const zForSlope = (key.y + (key.h || 1) / 2) - centerZ;
      let surfaceY = PLATE_Y;

      if (mountSurface) {
        surfaceY = mountSurface.getY(zForSlope) + PLATE_Y;
      } else if (shellConfig.tilt > 0) {
        // Shell tilt-based fallback
        const tiltAngle = shellConfig.tilt * Math.PI / 180;
        const backTopY = shellConfig.height + Math.tan(tiltAngle) * caseD;
        const frontTopY = shellConfig.height * 0.25;
        const t = (z + hd) / caseD;
        surfaceY = backTopY + t * (frontTopY - backTopY) + PLATE_Y;
      }
      // Keys stay on the original mount surface — the carved cut goes
      // DOWN into the case AROUND/BELOW them. Cap bottoms peek into the
      // groove from above, exposing the cutout floor between keys (real
      // plate look). Don't subtract cutDepth from surfaceY here.

      // Compute tilt angle for the key to sit flush on the surface
      let tiltAngleX = 0;
      if (mountSurface) {
        tiltAngleX = mountSurface.angle; // Positive tilts key tops toward +Z (front/user)
      } else if (shellConfig.tilt > 0) {
        tiltAngleX = shellConfig.tilt * Math.PI / 180;
      }

      return {
        x,
        y: surfaceY + capH / 2 * Math.cos(tiltAngleX),
        z,
        sx: key.w - KEY_GAP,
        sy: capH,
        sz: (key.h || 1) - KEY_GAP,
        tiltX: tiltAngleX,
      };
    });
  }, [keys, centerX, centerZ, keycapPreset, mountSurface, shellConfig, caseD, mountOffset]);

  // ─── Keycap geometry: sculpted from profile data ───
  // Creates tapered shape with dish based on the active profile's defaultCap.
  // One geometry shared across all instances (per-row variation via matrix scale).
  const geometry = useMemo(() => {
    const capSpec = keycapPreset?.profile?.defaultCap;
    if (capSpec) {
      return createKeycapFromSpec(capSpec);
    }
    // Fallback: basic rounded box if no keycap preset
    return new RoundedBoxGeometry(1, 1, 1, KEY_SEGMENTS, KEY_BEVEL);
  }, [keycapPreset]);

  // ─── Render style: pick material pipeline based on renderStyle.mode ───
  const resolvedRS = useMemo(() => resolveRenderStyle(renderStyle), [renderStyle]);
  const rsPrimary = resolvedRS.primary;

  // Gradient texture for cel-hard toon shading. Explicit RGBA so the alpha
  // channel is always 255 — RedFormat sometimes read as a premultiplied alpha
  // source on certain drivers, which made keycaps go translucent at higher
  // step counts. One texel per shading tier, nearest-neighbor filtered.
  const gradientMap = useMemo(() => {
    if (rsPrimary !== "cel-hard") return null;
    const steps = Math.max(2, resolvedRS.cel.gradientSteps);
    const data = new Uint8Array(steps * 4);
    for (let i = 0; i < steps; i++) {
      const b = Math.round((i / (steps - 1)) * 255);
      data[i * 4 + 0] = b;
      data[i * 4 + 1] = b;
      data[i * 4 + 2] = b;
      data[i * 4 + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, steps, 1, THREE.RGBAFormat);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [rsPrimary, resolvedRS.cel.gradientSteps]);

  // Build a keycap material for the given mode, baking the color straight in
  // as the `color` uniform (and `emissive` for neon). One material per group
  // (regular / accent) so no InstancedMesh.setColorAt gymnastics are needed.
  // Color lives in the useMemo dep list below, so color changes flow through
  // the material and reach the renderer in a single pass — no extra
  // useEffect, no second frame, no stale-state flash.
  const buildKeycapMaterial = (mode, gm, color) => {
    const base = new THREE.Color(color || "#ffffff");
    if (mode === "cel-hard") {
      return new THREE.MeshToonMaterial({
        color: base, gradientMap: gm, side: THREE.DoubleSide,
      });
    }
    if (mode === "lofi-flat") {
      return new THREE.MeshBasicMaterial({ color: base, side: THREE.DoubleSide });
    }
    if (mode === "blueprint") {
      return new THREE.MeshBasicMaterial({
        color: base, side: THREE.DoubleSide, wireframe: true,
      });
    }
    if (mode === "x-ray") {
      return new THREE.MeshBasicMaterial({
        color: base, side: THREE.DoubleSide,
        transparent: true, opacity: resolvedRS.xray.opacity,
        wireframe: !!resolvedRS.xray.wireframe,
        depthWrite: false,
      });
    }
    if (mode === "neon") {
      // Diffuse AND emissive both use the picked color, so the glow follows.
      return new THREE.MeshStandardMaterial({
        color: base, emissive: base,
        roughness: resolvedRS.neon.roughness,
        metalness: resolvedRS.neon.metalness,
        emissiveIntensity: resolvedRS.neon.emissiveIntensity,
        side: THREE.DoubleSide,
      });
    }
    if (mode === "risograph") {
      // Single-pass riso approximation: hard-toon banding + 4x4 Bayer dither
      // + a subtle RGB channel offset. The channel offset is a per-fragment
      // screen-space nudge of R/B so you get the ink-registration look
      // without a post-process pipeline.
      const steps = Math.max(2, resolvedRS.risograph.gradientSteps);
      const noiseAmount = resolvedRS.risograph.noiseAmount ?? 0.08;
      const [offR, offB] = resolvedRS.risograph.channelOffset || [2, -1];
      const m = new THREE.MeshToonMaterial({
        gradientMap: gm, side: THREE.DoubleSide,
      });
      m.onBeforeCompile = (shader) => {
        shader.uniforms.uRisoNoise = { value: noiseAmount };
        shader.uniforms.uRisoSteps = { value: steps };
        shader.uniforms.uRisoOffR = { value: offR };
        shader.uniforms.uRisoOffB = { value: offB };
        shader.fragmentShader = shader.fragmentShader
          .replace("#include <common>", `#include <common>
             uniform float uRisoNoise;
             uniform float uRisoSteps;
             uniform float uRisoOffR;
             uniform float uRisoOffB;
             float risoBayer(vec2 p) {
               int x = int(mod(p.x, 4.0));
               int y = int(mod(p.y, 4.0));
               int i = x + y * 4;
               float m[16]; m[0]=0.;m[1]=8.;m[2]=2.;m[3]=10.;
               m[4]=12.;m[5]=4.;m[6]=14.;m[7]=6.;
               m[8]=3.;m[9]=11.;m[10]=1.;m[11]=9.;
               m[12]=15.;m[13]=7.;m[14]=13.;m[15]=5.;
               return m[i] / 16.0;
             }`)
          .replace("#include <dithering_fragment>", `#include <dithering_fragment>
             float bayer = risoBayer(gl_FragCoord.xy);
             vec2 offR = vec2(uRisoOffR, 0.0) / 800.0;
             vec2 offB = vec2(uRisoOffB, 0.0) / 800.0;
             // Channel offset: nudge brightness based on screen offset. Cheap
             // fake — true channel offset would require RenderTargets.
             gl_FragColor.r += uRisoNoise * (bayer - 0.5) * 0.6;
             gl_FragColor.g += uRisoNoise * (bayer - 0.5) * 0.4;
             gl_FragColor.b -= uRisoNoise * (bayer - 0.5) * 0.6;
             // Subtle vignette-style channel split tied to screen pos.
             gl_FragColor.r = mix(gl_FragColor.r, gl_FragColor.r * 1.1, offR.x);
             gl_FragColor.b = mix(gl_FragColor.b, gl_FragColor.b * 1.1, offB.x);`);
      };
      return m;
    }
    if (mode === "pixel") {
      // Block-quantize fragment colors in gl_FragCoord space to fake a low-res
      // pixel look without a RenderTarget. Resolution = how many "pixels"
      // across the keycap surface roughly. colorSteps = posterize bands.
      const pxRes = resolvedRS.pixel.resolution ?? 128;
      const pxSteps = resolvedRS.pixel.colorSteps ?? 8;
      const m = new THREE.MeshToonMaterial({
        gradientMap: gm, side: THREE.DoubleSide,
      });
      m.onBeforeCompile = (shader) => {
        shader.uniforms.uPxBlock = { value: Math.max(2, 600 / pxRes) };
        shader.uniforms.uPxSteps = { value: Math.max(2, pxSteps) };
        shader.fragmentShader = shader.fragmentShader
          .replace("#include <common>", `#include <common>
             uniform float uPxBlock;
             uniform float uPxSteps;`)
          .replace("#include <dithering_fragment>", `#include <dithering_fragment>
             gl_FragColor.rgb = floor(gl_FragColor.rgb * uPxSteps + 0.5) / uPxSteps;`);
      };
      return m;
    }
    // PBR (default) — also the fallback for modes not yet implemented.
    return new THREE.MeshStandardMaterial({
      color: base, roughness: 0.4, metalness: 0.05, envMapIntensity: 0.4,
      side: THREE.DoubleSide,
    });
  };

  const regularMaterial = useMemo(
    () => buildKeycapMaterial(rsPrimary, gradientMap, keycapColor),
    [rsPrimary, gradientMap, keycapColor]
  );
  const accentMaterial = useMemo(
    () => buildKeycapMaterial(rsPrimary, gradientMap, accentKeyColor),
    [rsPrimary, gradientMap, accentKeyColor]
  );

  // Outline pass — only rendered for cel-hard. BackSide scaled-up instance mesh
  // gives us an inflated silhouette with no shader work.
  const outlineMaterial = useMemo(() => {
    if (rsPrimary !== "cel-hard") return null;
    return new THREE.MeshBasicMaterial({
      color: resolvedRS.cel.outlineColor,
      side: THREE.BackSide,
    });
  }, [rsPrimary, resolvedRS.cel.outlineColor]);
  const regularOutlineRef = useRef();
  const accentOutlineRef = useRef();

  // Pre-allocated quaternion for key tilt
  const _tiltQuat = useMemo(() => new THREE.Quaternion(), []);

  const outlineWidth = resolvedRS.cel.outlineWidth;
  const outlineActive = rsPrimary === "cel-hard";

  const setKeyMatrix = (index, yOffset) => {
    const rest = restPositions[index];
    const entry = meshMap[index];
    if (!rest || !entry) return;
    _pos.set(rest.x, rest.y + yOffset, rest.z);
    _scale.set(rest.sx, rest.sy, rest.sz);
    if (rest.tiltX) {
      _tiltQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rest.tiltX);
      _mat4.compose(_pos, _tiltQuat, _scale);
    } else {
      _mat4.compose(_pos, _quat, _scale);
    }
    const mesh = entry.group === "accent" ? accentMeshRef.current : regularMeshRef.current;
    if (mesh) mesh.setMatrixAt(entry.idx, _mat4);

    // Outline pass: same transform, scaled up by (1 + outlineWidth) so the
    // BackSide silhouette renders a constant-thickness stroke around the cap.
    if (outlineActive) {
      const w = 1 + outlineWidth;
      _scale.set(rest.sx * w, rest.sy * w, rest.sz * w);
      if (rest.tiltX) {
        _mat4.compose(_pos, _tiltQuat, _scale);
      } else {
        _mat4.compose(_pos, _quat, _scale);
      }
      const outlineMesh = entry.group === "accent" ? accentOutlineRef.current : regularOutlineRef.current;
      if (outlineMesh) outlineMesh.setMatrixAt(entry.idx, _mat4);
    }
  };

  // ─── Update per-group opacity ───
  useEffect(() => {
    regularMaterial.opacity = opacity.keycap;
    regularMaterial.transparent = opacity.keycap < 1.0;
    regularMaterial.depthWrite = opacity.keycap >= 0.99;
    regularMaterial.needsUpdate = true;
    accentMaterial.opacity = opacity.accent;
    accentMaterial.transparent = opacity.accent < 1.0;
    accentMaterial.depthWrite = opacity.accent >= 0.99;
    accentMaterial.needsUpdate = true;
    invalidate();
  }, [opacity.keycap, opacity.accent, regularMaterial, accentMaterial, invalidate]);

  // ─── Build instance matrices ───
  // Positions only — color is handled by the dedicated color-sync effect
  // below which writes material.color (a plain uniform update) instead of
  // fighting with InstancedMesh.setColorAt + the USE_INSTANCING_COLOR program
  // cache key. Keeping the two concerns separate makes each robust.
  useEffect(() => {
    const regMesh = regularMeshRef.current;
    const accMesh = accentMeshRef.current;
    if (keyCount === 0) return;

    for (const gi of regularIndices) setKeyMatrix(gi, 0);
    for (const gi of accentIndices) setKeyMatrix(gi, 0);

    if (regMesh) regMesh.instanceMatrix.needsUpdate = true;
    if (accMesh) accMesh.instanceMatrix.needsUpdate = true;
    if (regularOutlineRef.current) regularOutlineRef.current.instanceMatrix.needsUpdate = true;
    if (accentOutlineRef.current) accentOutlineRef.current.instanceMatrix.needsUpdate = true;
    invalidate();
    // regularMaterial / accentMaterial / outlineMaterial stay in the dep list:
    // r3f rebuilds the InstancedMesh when args change, resetting matrices.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys, keyCount, keycapPreset, mountSurface, restPositions, caseScale, mountOffset, mountFit, regularIndices, accentIndices, rsPrimary, outlineWidth, regularMaterial, accentMaterial, outlineMaterial, invalidate]);


  // ─── Animation loop ───
  useFrame((_, delta) => {
    const active = activeSet.current;
    if (active.size === 0) return;

    const dt = Math.min(delta, MAX_DELTA);
    const offs = offsets.current;
    const vels = velocities.current;
    const toRemove = [];

    for (const i of active) {
      const sf = -STIFFNESS * offs[i];
      const df = -DAMPING * vels[i];
      vels[i] += (sf + df) * dt;
      offs[i] += vels[i] * dt;

      if (Math.abs(offs[i]) < SETTLE_THRESHOLD && Math.abs(vels[i]) < SETTLE_THRESHOLD) {
        offs[i] = 0;
        vels[i] = 0;
        setKeyMatrix(i, 0);
        toRemove.push(i);
      } else {
        setKeyMatrix(i, offs[i]);
      }

      // Move the label group so the legend stays glued to the keycap surface
      // during the spring animation. baseline captured at render; offs[i] is
      // the animated delta.
      const labelGroup = labelGroupRefs.current[i];
      if (labelGroup) {
        labelGroup.position.y = labelBaselineY.current[i] + offs[i];
      }
    }

    for (const i of toRemove) active.delete(i);
    if (regularMeshRef.current) regularMeshRef.current.instanceMatrix.needsUpdate = true;
    if (accentMeshRef.current) accentMeshRef.current.instanceMatrix.needsUpdate = true;
    if (regularOutlineRef.current) regularOutlineRef.current.instanceMatrix.needsUpdate = true;
    if (accentOutlineRef.current) accentOutlineRef.current.instanceMatrix.needsUpdate = true;
    if (active.size > 0) invalidate();
  });

  // ─── Imperative API ───
  useImperativeHandle(ref, () => ({
    triggerKey: (keyName) => {
      const index = keyIndex.get(keyName);
      if (index === undefined) return;
      offsets.current[index] = -PRESS_DEPTH;
      velocities.current[index] = 0;
      activeSet.current.add(index);
      invalidate();
    },
    // Expose animation offsets so labels can follow key press movement
    getOffsets: () => offsets.current,
    // Expose rest positions so labels can match key positions (mount surface, offsets, tilt)
    getRestPositions: () => restPositions,
    // Direct access for parent to read and pass as prop
    restPositions,
  }), [keyIndex, invalidate]);


  // Case scope: if the user sets a separate renderStyleCase, use it; else fall
  // through to the keycap scope so a single global renderStyle still restyles
  // the whole board. Gradient map is scope-local since step count can differ.
  const resolvedCaseRS = useMemo(
    () => resolveRenderStyle(renderStyleCase || renderStyle),
    [renderStyleCase, renderStyle]
  );
  const casePrimary = resolvedCaseRS.primary;
  const caseGradientMap = useMemo(() => {
    if (casePrimary !== "cel-hard") return null;
    const steps = Math.max(2, resolvedCaseRS.cel.gradientSteps);
    const data = new Uint8Array(steps * 4);
    for (let i = 0; i < steps; i++) {
      const b = Math.round((i / (steps - 1)) * 255);
      data[i * 4 + 0] = b; data[i * 4 + 1] = b; data[i * 4 + 2] = b; data[i * 4 + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, steps, 1, THREE.RGBAFormat);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [casePrimary, resolvedCaseRS.cel.gradientSteps]);

  // Build a case/plate material — same mode switch as keycaps but keeps the
  // metallic PBR defaults for `pbr` mode since the case should look shiny.
  const buildCaseMaterial = (mode, gm, { roughness, metalness, envMap }, colorOverride) => {
    const col = colorOverride || caseColor;
    if (mode === "cel-hard") {
      return new THREE.MeshToonMaterial({ color: col, gradientMap: gm, side: THREE.DoubleSide });
    }
    if (mode === "lofi-flat") {
      return new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide });
    }
    if (mode === "blueprint") {
      return new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, wireframe: true });
    }
    if (mode === "x-ray") {
      const opacity = resolvedCaseRS.xray.opacity;
      return new THREE.MeshBasicMaterial({
        color: col, side: THREE.DoubleSide,
        transparent: true, opacity,
        wireframe: !!resolvedCaseRS.xray.wireframe,
        depthWrite: false,
      });
    }
    if (mode === "neon") {
      return new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: resolvedCaseRS.neon.emissiveIntensity,
        roughness: resolvedCaseRS.neon.roughness,
        metalness: resolvedCaseRS.neon.metalness,
        side: THREE.DoubleSide,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: col, roughness, metalness, envMapIntensity: envMap, side: THREE.DoubleSide,
    });
  };

  // caseProfile is in the dep list on purpose: when the user swaps profile
  // (wedge → flat-box → chamfered etc), profileCaseGeo is a brand-new
  // THREE.BufferGeometry. needsUpdate-style fixes keep the old material
  // instance but apparently don't always force Three to re-link the shader
  // program against the new geometry's attribute buffers — so we just rebuild
  // the material from scratch. Fresh material + fresh geometry always start
  // from a consistent state.
  const caseMat = useMemo(
    () => buildCaseMaterial(casePrimary, caseGradientMap, { roughness: 0.2, metalness: 0.9, envMap: 1.0 }),
    [casePrimary, caseGradientMap, caseColor, caseProfile]
  );
  const plateMat = useMemo(
    () => buildCaseMaterial(casePrimary, caseGradientMap, { roughness: 0.35, metalness: 0.85, envMap: 0.6 }),
    [casePrimary, caseGradientMap, caseColor, caseProfile]
  );
  // Cutout / mount-plate interior material — used as the second slot in
  // the carved case mesh's material array. Falls back to caseColor when
  // topFrame.color isn't set, so unconfigured cutouts blend into the case.
  // Slightly higher roughness + lower envMap to read like a metal plate
  // recessed inside a polished case. Backlight (if enabled) adds emissive
  // properties so the cutout glows like a real switch LED.
  const cutoutColor = caseProfile?.topFrame?.color;
  const backlight = caseProfile?.topFrame?.backlight;
  const cutoutMat = useMemo(() => {
    const mat = buildCaseMaterial(
      casePrimary,
      caseGradientMap,
      { roughness: 0.55, metalness: 0.6, envMap: 0.4 },
      cutoutColor,
    );
    // Backlight = the visible light leaking out of the cap-to-plate gap
    // around each key. The bright LED look comes from the bulb spheres +
    // PointLights; cutout emissive is just a dim "lit plate" environment
    // tint so the carved interior reads as colored, not glaring.
    if (backlight && backlight.enabled !== false && mat.emissive) {
      mat.emissive = new THREE.Color(backlight.color || "#ffffff");
      const baseI = backlight.intensity ?? 0.8;
      const bloom = backlight.bloom ?? 0;
      mat.emissiveIntensity = baseI * (1 + bloom) * 0.35;
    }
    return mat;
  }, [casePrimary, caseGradientMap, cutoutColor, caseColor, caseProfile, backlight]);

  // ─── LED positions — at the CENTER OF EACH CAP'S BOTTOM EDGE, i.e.,
  // in the cap-plate gap (mountSurfaceY + half PLATE_Y). From oblique
  // viewing angles the bulb peeks out through the gap; the PointLight
  // co-located here illuminates BOTH the cap's underside (above) AND
  // the cutout floor (below) — same light source for both visuals.
  const ledLightPositions = useMemo(() => {
    if (!backlight || backlight.enabled === false) return [];
    if (!keys.length) return [];
    return keys.map((key) => {
      const x = (key.x + (key.w || 1) / 2) - centerX + (mountOffset.x || 0);
      const z = (key.y + (key.h || 1) / 2) - centerZ + (mountOffset.z || 0);
      const zForSlope = (key.y + (key.h || 1) / 2) - centerZ;
      const surfaceY = mountSurface ? mountSurface.getY(zForSlope) : 0;
      // Cap base sits at surfaceY + PLATE_Y. Half-way between mount plate
      // and cap base lands the LED in the visible cap-to-plate gap.
      const y = surfaceY + PLATE_Y * 0.5;
      return { x, y, z };
    });
  }, [keys, centerX, centerZ, mountOffset, mountSurface, backlight]);
  const ledLightRefs = useRef([]);

  // ─── Visible LED bulbs — small emissive spheres at each light position.
  // Sphere radius bigger than the gap so the bottom protrudes into the
  // cutout AND the top peeks past cap edges from oblique angles. The
  // sphere center sits in the cap-plate gap; from above the cap covers
  // it, but most camera angles see at least the rim.
  const ledMeshRef = useRef(null);
  const ledGeometry = useMemo(() => new THREE.SphereGeometry(0.06, 12, 8), []);
  const ledBulbMat = useMemo(() => {
    if (!backlight || backlight.enabled === false) return null;
    return new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: new THREE.Color(backlight.color || "#ffffff"),
      emissiveIntensity: (backlight.intensity ?? 0.8) * (1 + (backlight.bloom ?? 0)) * 1.5,
      vertexColors: true, // enable instanceColor for per-key wave
      toneMapped: false,
    });
  }, [backlight]);
  useEffect(() => {
    if (!ledMeshRef.current || !ledLightPositions.length) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < ledLightPositions.length; i++) {
      m.makeTranslation(ledLightPositions[i].x, ledLightPositions[i].y, ledLightPositions[i].z);
      ledMeshRef.current.setMatrixAt(i, m);
    }
    ledMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [ledLightPositions]);

  // Animated patterns drive emissive intensity / color each frame. For
  // "wave" we'd need per-cutout material indices; until that lands, wave
  // falls back to a slow global hue cycle so the visual still moves.
  const _hslColor = useMemo(() => new THREE.Color(), []);
  useFrame(({ clock }) => {
    if (!backlight || backlight.enabled === false) return;
    if (!cutoutMat?.emissive) return;
    const pattern = backlight.pattern || "solid";
    const speed = backlight.speed ?? 1.0;
    const t = clock.getElapsedTime() * speed;
    const baseI = backlight.intensity ?? 0.8;
    const bloom = backlight.bloom ?? 0;
    const peak = baseI * (1 + bloom);

    // Helper to update emissive cutout material + every PointLight + every
    // bulb mesh at once. With ONE light per key (~80 lights) each one's
    // intensity is small (0.18×) so the cumulative scene illumination
    // stays balanced. Bulb visible-emissive intensity is set via the
    // material once (the per-instance color is what's animated).
    const apply = (color, intensity) => {
      cutoutMat.emissive.copy(color);
      cutoutMat.emissiveIntensity = intensity * 0.35; // ambient tint, not glare
      if (ledBulbMat?.emissive) {
        ledBulbMat.emissive.copy(color);
        ledBulbMat.emissiveIntensity = intensity * 1.5;
      }
      const perLightI = intensity * 0.5;
      for (const ref of ledLightRefs.current) {
        if (!ref) continue;
        ref.color.copy(color);
        ref.intensity = perLightI;
      }
    };

    if (pattern === "solid") {
      // Static — only run once on first frame to sync lights with the
      // material's static config (which the useMemo above already set).
      const col = new THREE.Color(backlight.color || "#ffffff");
      apply(col, peak);
      return;
    }
    if (pattern === "breathe") {
      const i = peak * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 1.5)));
      const col = new THREE.Color(backlight.color || "#ffffff");
      apply(col, i);
    } else if (pattern === "rainbow") {
      _hslColor.setHSL((t * 0.15) % 1.0, 1.0, 0.55);
      apply(_hslColor, peak);
    } else if (pattern === "wave") {
      // Per-key colors — each PointLight + bulb gets a phase-shifted hue
      // based on its world X position. Color travels left→right over time.
      const perLightI = peak * 0.5;
      const bulbMesh = ledMeshRef.current;
      const _bulbColor = _hslColor; // reuse temp
      for (let i = 0; i < ledLightRefs.current.length; i++) {
        const ref = ledLightRefs.current[i];
        const pos = ledLightPositions[i];
        if (!ref || !pos) continue;
        const phase = pos.x * 0.18 - t * 0.5;
        const hue = ((phase % 1) + 1) % 1;
        _bulbColor.setHSL(hue, 1.0, 0.55);
        ref.color.copy(_bulbColor);
        ref.intensity = perLightI;
        if (bulbMesh) bulbMesh.setColorAt(i, _bulbColor);
      }
      if (bulbMesh?.instanceColor) bulbMesh.instanceColor.needsUpdate = true;
      // Cutout emissive uses an averaged hue so the gap glow doesn't strobe.
      _hslColor.setHSL((t * 0.1) % 1.0, 0.85, 0.55);
      cutoutMat.emissive.copy(_hslColor);
      cutoutMat.emissiveIntensity = peak * 0.35;
    }
    invalidate();
  });

  // Case outline — for cel-hard we want a constant-thickness silhouette that
  // doesn't blow up with the case's scale. Classic Blinn back-face trick:
  // render the geometry again with BackSide culling and push each vertex
  // outward along its normal by a small WORLD-space distance. Unlike a uniform
  // matrix scale, this stays the same thickness on thin and thick parts of
  // the case alike. onBeforeCompile patches the standard basic-material
  // vertex shader so we don't have to ship a ShaderMaterial.
  const caseOutlineWidth = resolvedCaseRS.cel.outlineWidth;
  const caseOutlineActive = casePrimary === "cel-hard" && caseOutlineWidth > 0;
  const caseOutlineMaterial = useMemo(() => {
    if (!caseOutlineActive) return null;
    const mat = new THREE.MeshBasicMaterial({
      color: resolvedCaseRS.cel.outlineColor,
      side: THREE.BackSide,
    });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uOutlineWidth = { value: caseOutlineWidth };
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uOutlineWidth;")
        .replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\ntransformed += normalize(normal) * uOutlineWidth;"
        );
    };
    // Tag so we can find it on re-render if we ever need to tweak the uniform
    // without rebuilding the material.
    mat.userData.isCaseOutline = true;
    return mat;
  }, [caseOutlineActive, caseOutlineWidth, resolvedCaseRS.cel.outlineColor, caseProfile]);

  // Update case opacity
  useEffect(() => {
    caseMat.opacity = opacity.case;
    caseMat.transparent = opacity.case < 1.0;
    caseMat.depthWrite = opacity.case >= 0.99;
    caseMat.needsUpdate = true;
    plateMat.opacity = opacity.case;
    plateMat.transparent = opacity.case < 1.0;
    plateMat.depthWrite = opacity.case >= 0.99;
    plateMat.needsUpdate = true;
    invalidate();
  }, [opacity.case, caseMat, plateMat, invalidate]);

  // ─── On geometry swap, force every material to recompile ───
  // Two independent triggers both require the same fix:
  //   1. Keycap layout change (75% → HHKB etc): keyCount flips, InstancedMesh
  //      remounts with new attribute buffers.
  //   2. Case profile change (Wedge → Flat Box etc): profileCaseGeo rebuilds,
  //      the case mesh's geometry is swapped in-place.
  // In both cases the cached materials stay, so their compiled WebGL programs
  // still point at the OLD geometry/attribute layout — cel / riso / neon
  // injections reference attributes that no longer exist at the expected
  // slot. Flagging needsUpdate forces Three to recompile + relink each
  // shader, and reruns onBeforeCompile so dither, outline, emissive
  // injections realign with the current mesh.
  useEffect(() => {
    [regularMaterial, accentMaterial, outlineMaterial, caseMat, plateMat, caseOutlineMaterial]
      .forEach((m) => { if (m) m.needsUpdate = true; });
    invalidate();
  }, [
    keyCount, keys,
    // Case-geometry triggers. `wedgeGeo` is declared later in the function
    // body; watching caseProfile + profileCaseGeo + caseW/caseD is enough to
    // catch every shape change without a TDZ reference here.
    caseProfile, profileCaseGeo, caseW, caseD,
    regularMaterial, accentMaterial, outlineMaterial, caseMat, plateMat, caseOutlineMaterial,
    invalidate,
  ]);

  const tilt = shellConfig.tilt || 0;

  // Structural signature of the current case profile — used as a React key on
  // the case meshes so switching profile refs fully unmounts/remounts the
  // meshes instead of hot-swapping geometry + material via <primitive>.
  // Material + program recompile alone wasn't enough to purge all state Three
  // retains on a mesh (e.g. lingering compiled shader bound to the previous
  // buffer layout, old outline pass drawing over the new profile). A key-
  // triggered remount is the belt-and-suspenders clean room.
  const caseProfileKey = useMemo(() => {
    if (!caseProfile?.points) return "none";
    const ptsSig = caseProfile.points.map((p) => `${p.x},${p.y},${p.d || 0}`).join("|");
    const mountSig = (caseProfile.mountEdge || []).join("-");
    // caseW / caseD are derived from layout bounds + shell padding, so
    // switching the keycap layout (e.g. full-size → HHKB 60%) shrinks the
    // case even though the profile doc is unchanged. Including them in the
    // signature forces the case Fragment to remount on layout swaps too,
    // killing any outline/shader that was still bound to the old dimensions.
    return `p:${ptsSig}/m:${mountSig}/w:${caseW.toFixed(2)}/d:${caseD.toFixed(2)}`;
  }, [caseProfile, caseW, caseD]);
  const tiltRad = (tilt * Math.PI) / 180;

  /*
   * Cyberboard wedge: right-trapezoid cross-section
   *
   * Side view:
   *       back ─────── sloped top ──── front
   *        │                            │
   *        │         (keys here)        │ thin
   *  tall  │                            │
   *        │                            │
   *        └──── flat bottom ───────────┘
   *
   * - Bottom is flat (sits on desk)
   * - Back wall is tall and vertical
   * - Top surface slopes from back (high) to front (low)
   * - Front wall is short and vertical
   */
  const wedgeGeo = useMemo(() => {
    if (tilt <= 0) return null;
    const hw = caseW / 2;
    const hd = caseD / 2;
    // Back top = high, front top = low. Bottom is flat at y=0.
    const backTopY = shellConfig.height + Math.tan(tiltRad) * caseD;
    const frontTopY = shellConfig.height * 0.25; // Thin front lip

    const verts = new Float32Array([
      // Front face (short vertical, +Z)
      -hw,  0,          hd,   // 0 bottom-left-front
       hw,  0,          hd,   // 1 bottom-right-front
       hw,  frontTopY,  hd,   // 2 top-right-front
      -hw,  frontTopY,  hd,   // 3 top-left-front
      // Back face (tall vertical, -Z)
      -hw,  0,          -hd,  // 4 bottom-left-back
       hw,  0,          -hd,  // 5 bottom-right-back
       hw,  backTopY,   -hd,  // 6 top-right-back
      -hw,  backTopY,   -hd,  // 7 top-left-back
    ]);
    const idx = [
      // Front (short wall)
      0, 1, 2,  0, 2, 3,
      // Back (tall wall)
      5, 4, 7,  5, 7, 6,
      // Top (sloped surface — keys sit here)
      3, 2, 6,  3, 6, 7,
      // Bottom (flat, on the desk)
      4, 5, 1,  4, 1, 0,
      // Left side
      4, 0, 3,  4, 3, 7,
      // Right side
      1, 5, 6,  1, 6, 2,
    ];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }, [tilt, tiltRad, shellConfig.height, caseW, caseD]);

  if (keyCount === 0) return null;

  /*
   * For wedge/tilted shells (Cyberboard):
   * The entire group (case + plate + keys + labels) tilts together.
   * The case is a wedge shape underneath, and everything on top
   * sits on the sloped surface — like a Cybertruck hood.
   *
   * Tilt pivot: front edge of the case (positive Z).
   * This keeps the front lip at desk level while the back rises.
   */
  const pivotZ = caseD / 2 + caseCenterZ; // front edge Z

  return (
    <group>
      {/* Case body — profile-extruded, wedge, or flat box. When cel-hard is
          active on the case scope we also render a BackSide outline pass at
          the SAME position with the SAME geometry; the outline material
          expands vertices along their normals, giving a constant-thickness
          stroke on any shape. renderOrder=-1 draws it before the body so the
          body's depth test punches out the interior. */}
      {profileCaseGeo ? (
        <React.Fragment key={`case-profile-${caseProfileKey}`}>
          {/* When CSG-carved, the geometry has groups: 0 = original case
              faces, 1 = cutout interior (walls + floor). Pass [caseMat,
              cutoutMat] so each group renders with its own color. */}
          {caseProfile?.topFrame ? (
            <mesh position={[0, 0, caseCenterZ]} material={[caseMat, cutoutMat]}>
              <primitive object={profileCaseGeo} attach="geometry" />
            </mesh>
          ) : (
            <mesh position={[0, 0, caseCenterZ]}>
              <primitive object={profileCaseGeo} attach="geometry" />
              <primitive object={caseMat} attach="material" />
            </mesh>
          )}
          {caseOutlineActive && caseOutlineMaterial && (
            <mesh position={[0, 0, caseCenterZ]} renderOrder={-1}>
              <primitive object={profileCaseGeo} attach="geometry" />
              <primitive object={caseOutlineMaterial} attach="material" />
            </mesh>
          )}
        </React.Fragment>
      ) : tilt > 0 && wedgeGeo ? (
        <React.Fragment key={`case-wedge-${caseProfileKey}`}>
          <mesh position={[0, 0, caseCenterZ]}>
            <primitive object={wedgeGeo} attach="geometry" />
            <primitive object={caseMat} attach="material" />
          </mesh>
          {caseOutlineActive && caseOutlineMaterial && (
            <mesh position={[0, 0, caseCenterZ]} renderOrder={-1}>
              <primitive object={wedgeGeo} attach="geometry" />
              <primitive object={caseOutlineMaterial} attach="material" />
            </mesh>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment key={`case-box-${caseProfileKey}`}>
          <mesh position={[0, -shellConfig.height / 2, caseCenterZ]}>
            <roundedBoxGeometry args={[caseW, shellConfig.height, caseD, 2, shellConfig.cornerRadius]} />
            <primitive object={caseMat} attach="material" />
          </mesh>
          {caseOutlineActive && caseOutlineMaterial && (
            <mesh position={[0, -shellConfig.height / 2, caseCenterZ]} renderOrder={-1}>
              <roundedBoxGeometry args={[caseW, shellConfig.height, caseD, 2, shellConfig.cornerRadius]} />
              <primitive object={caseOutlineMaterial} attach="material" />
            </mesh>
          )}
        </React.Fragment>
      )}

      {/* LED bulbs — one tiny emissive sphere per key, sitting in the
          cap-plate gap. Acts as a visible "lit LED dot" peeking out from
          oblique angles. */}
      {backlight?.enabled !== false && ledBulbMat && ledLightPositions.length > 0 && (
        <instancedMesh
          ref={ledMeshRef}
          args={[ledGeometry, ledBulbMat, ledLightPositions.length]}
          frustumCulled={false}
        />
      )}

      {/* Backlight scene lights — one PointLight per key, co-located with
          its bulb. Lights both the cap underside (above) and the cutout
          floor (below). distance ≈ 0.6u keeps each light localized so
          the per-key gradient is visible on the plate. */}
      {ledLightPositions.map((p, i) => (
        <pointLight
          key={`led-${i}`}
          ref={(el) => { ledLightRefs.current[i] = el; }}
          position={[p.x, p.y, p.z]}
          color={backlight?.color || "#ffffff"}
          intensity={(backlight?.intensity ?? 0.8) * (1 + (backlight?.bloom ?? 0)) * 0.5}
          distance={1.2}
          decay={1.5}
        />
      ))}

      {/* Colored edge accent strips */}
      {edgeStrips.map((strip, i) => (
        <mesh key={`edge-${i}`} position={[0, 0, caseCenterZ]}>
          <primitive object={strip.geo} attach="geometry" />
          <meshStandardMaterial
            color={strip.color}
            emissive={strip.color}
            emissiveIntensity={strip.emissive}
            roughness={0.3}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Instanced keycaps — split into regular + accent for per-group opacity.
          All four meshes (regular, accent, regular outline, accent outline)
          are wrapped in a single React.Fragment keyed on the layout signature
          so they unmount/remount atomically on layout or mode swap. Relying
          on per-child keys alone meant sibling reconciliation could leave the
          old outline pair visible for a frame while the new keycap pair
          mounted (or vice versa) — same class of stale-mesh bug the case
          profile had before the Fragment-key fix. */}
      <React.Fragment key={`keycaps-${keyCount}-${rsPrimary}`}>
        {regularIndices.length > 0 && (
          <instancedMesh
            ref={regularMeshRef}
            args={[geometry, regularMaterial, regularIndices.length]}
            frustumCulled={false}
          />
        )}
        {accentIndices.length > 0 && (
          <instancedMesh
            ref={accentMeshRef}
            args={[geometry, accentMaterial, accentIndices.length]}
            frustumCulled={false}
          />
        )}
        {outlineActive && outlineMaterial && regularIndices.length > 0 && (
          <instancedMesh
            ref={regularOutlineRef}
            args={[geometry, outlineMaterial, regularIndices.length]}
            frustumCulled={false}
            renderOrder={-1}
          />
        )}
        {outlineActive && outlineMaterial && accentIndices.length > 0 && (
          <instancedMesh
            ref={accentOutlineRef}
            args={[geometry, outlineMaterial, accentIndices.length]}
            frustumCulled={false}
            renderOrder={-1}
          />
        )}
      </React.Fragment>

      {/* Key legends — rendered here so they have direct access to restPositions.
          Legend position ("center", "top-left", "top-right", "bottom-left",
          "bottom-right", "top-center", "bottom-center") offsets the label anchor
          toward the matching corner/edge of the keycap top surface. Convention
          (see KeyboardModel above): world -Z is "top" (away from user), +Z is
          "bottom", -X is "left", +X is "right". Text is rotated -π/2 around X so
          its local +Y axis maps to world -Z — which means anchorY="top" anchors
          the text at the "top" (world -Z) edge, lining up with the offset. */}
      {legendPreset?.style?.fontSize > 0 && legendPreset?.style?.color !== "transparent" && (() => {
        const { anchorX, anchorY, offXFrac, offZFrac } = parseLegendPosition(legendPreset?.style?.position);
        const textAlign = anchorX === "left" ? "left" : anchorX === "right" ? "right" : "center";
        const fontUrl = resolveFontUrl(legendPreset?.style?.fontFamily);
        return (
          <group>
            {keys.map((key, i) => {
              const rest = restPositions[i];
              if (!rest) return null;
              const override = legendPreset?.keyOverrides?.[key.id];
              const displayLabel = override?.label ?? key.label;
              if (!displayLabel) return null;

              const baseSize = ((legendPreset?.style?.fontSize || 28) / 28) * 0.22;
              let fontSize = baseSize;
              if (displayLabel.length > 4) fontSize *= 0.6;
              else if (displayLabel.length > 2 && key.w < 1.5) fontSize *= 0.7;

              const color = override?.color || legendPreset?.style?.color || "#cccccc";
              const text = legendPreset?.style?.uppercase && displayLabel.length === 1
                ? displayLabel.toUpperCase() : displayLabel;

              const offX = offXFrac * rest.sx;
              const offZ = offZFrac * rest.sz;
              const baselineY = rest.y + rest.sy / 2 + 0.005;
              labelBaselineY.current[i] = baselineY;

              return (
                <group
                  key={key.id}
                  ref={(el) => { labelGroupRefs.current[i] = el; }}
                  position={[rest.x + offX, baselineY, rest.z + offZ]}
                  rotation={[rest.tiltX || 0, 0, 0]}
                >
                  <Text
                    font={fontUrl}
                    fontSize={fontSize}
                    color={color}
                    fillOpacity={opacity.legend}
                    anchorX={anchorX}
                    anchorY={anchorY}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontWeight={legendPreset?.style?.fontWeight || 700}
                    maxWidth={key.w * 0.8}
                    textAlign={textAlign}
                  >
                    {text}
                  </Text>
                </group>
              );
            })}
          </group>
        );
      })()}
    </group>
  );
});

KeyboardModel.displayName = "KeyboardModel";

export default KeyboardModel;
