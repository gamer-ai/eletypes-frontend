/**
 * Bundled case profile presets — "eletypes-caseProfile/1" assets.
 */

export const CYBERBOARD_WEDGE_PROFILE = {
  schema: "eletypes-caseProfile/1",
  id: "profile-cyberboard-wedge",
  meta: { name: "Cyberboard Wedge" },
  caseProfile: {
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 12 },
      { x: 82, y: 30, d: 2 },
      { x: 0, y: 12 },
    ],
    mountEdge: [3, 4],
    coloredEdges: [
      { from: 2, to: 3, color: "#0e0708", emissive: 0.6 },
      { from: 1, to: 2, color: "#693f88" },
      { from: 0, to: 1, color: "#7b5499" },
      { from: 4, to: 0, color: "#36223a" },
      { from: 3, to: 4, color: "#483232" },
    ],
    // Plate-style — one cutout per key. switchHoleSize is a scale on the
    // key footprint: 1.05 = hole 5% larger than key, so a thin rim of
    // recessed plate surface shows around each cap from above. color picks
    // the visible plate tone — dark gunmetal contrasts the lavender case.
    // backlight adds an emissive LED glow to the plate; the cap-to-plate
    // gap reads as light bleeding up around each key.
    topFrame: {
      cutoutMode: "plate",
      switchHoleSize: 1.05,
      cutDepth: 0.1,
      color: "#1a1a20",
      backlight: {
        enabled: true,
        color: "#ff44aa",
        intensity: 1.0,
        pattern: "wave",
        speed: 0.8,
        bloom: 0.5,
      },
    },
  },
  mount: {
    offset: { x: 0.1, y: 0, z: 0.7 },
    fit: 0.85,
    caseScale: 1.15,
    extrudeWidth: 0.9,
  },
};

export const FLAT_BOX_PROFILE = {
  schema: "eletypes-caseProfile/1",
  id: "profile-flat-box",
  meta: { name: "Flat Box" },
  caseProfile: {
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 15 },
      { x: 0, y: 15 },
    ],
    mountEdge: [3, 2],
  },
  mount: {
    offset: { x: 0, y: 0, z: 0 },
    fit: 0.85,
    caseScale: 1.15,
    extrudeWidth: 0.9,
  },
};

export const CHAMFERED_WEDGE_PROFILE = {
  schema: "eletypes-caseProfile/1",
  id: "profile-chamfered-wedge",
  meta: { name: "Chamfered Wedge" },
  caseProfile: {
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 45 },
      { x: 90, y: 50, d: 3 },
      { x: 10, y: 16, d: 3 },
      { x: 0, y: 12 },
    ],
    mountEdge: [5, 2],
  },
  mount: {
    offset: { x: 0.1, y: 0, z: 0.7 },
    fit: 0.85,
    caseScale: 1.15,
    extrudeWidth: 0.9,
  },
};

export const ERGONOMIC_PROFILE = {
  schema: "eletypes-caseProfile/1",
  id: "profile-ergonomic",
  meta: { name: "Ergonomic" },
  caseProfile: {
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 35 },
      { x: 70, y: 28 },
      { x: 0, y: 18 },
    ],
    mountEdge: [4, 2],
  },
  mount: {
    offset: { x: 0.1, y: 0, z: 0.5 },
    fit: 0.85,
    caseScale: 1.15,
    extrudeWidth: 0.9,
  },
};
