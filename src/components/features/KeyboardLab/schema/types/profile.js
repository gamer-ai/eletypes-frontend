/**
 * Case Profile Schema — "eletypes-caseProfile/1"
 *
 * Defines the case cross-section profile (2D points) and mount settings
 * (offset, fit, scale, extrusion width) as a reusable asset.
 *
 * Named "caseProfile" (not "profile") to avoid collision with keycap profile.
 *
 * @typedef {Object} CaseProfileAsset
 * @property {"eletypes-caseProfile/1"} schema
 * @property {string} id
 * @property {{name:string, author?:string}} meta
 * @property {CaseProfile} caseProfile
 * @property {MountSettings} mount
 *
 * @typedef {Object} CaseProfile
 * @property {Array<{x:number, y:number, d?:number}>} points — Cross-section polygon
 * @property {number[]} mountEdge — [fromIndex, toIndex] edge where keys mount
 * @property {ColoredEdge[]} [coloredEdges] — Accent-colored edges on the case
 * @property {TopFrame} [topFrame] — Optional shallow cutouts in the case top
 *
 * @typedef {Object} ColoredEdge
 * @property {number} from       — Start point index
 * @property {number} to         — End point index
 * @property {string} color      — Hex color for this edge strip
 * @property {number} [emissive] — Emissive intensity 0-1 (default 0.5, LED-strip glow)
 *
 * @typedef {Object} TopFrame
 *   Shallow grooves cut into the case top (real CSG subtraction — produces
 *   one mesh with cavities baked in, NOT a separate plate on top).
 * @property {"plate"|"tray"} cutoutMode
 *   - "plate": one switch-sized hole per key (real keyboard plate look).
 *              Hole size scales with the key — hole.w = key.w - (1 - switchHoleSize).
 *   - "tray":  one rectangular cutout per group (cluster bbox + borderWidth).
 * @property {number} [switchHoleSize=1.05]   — plate mode — SCALE on key
 *   footprint. >1 = hole bigger than key (visible plate rim around cap).
 *   <1 = hole smaller than key (hidden by cap, real metal plate look).
 * @property {"all"|"per-row"|"per-cluster"} [grouping="all"]
 *   tray mode only — how to cluster keys into cutout groups.
 *   Ignored in plate mode (cluster spacing emerges naturally from key gaps).
 * @property {number} [borderWidth=0.2]       — tray mode — outer offset around cluster bbox.
 * @property {number} [cutDepth=0.1]          — depth of the groove (key units).
 * @property {number} [cornerRadius=0]        — tray mode only — inner corner radius.
 *   Plate mode is always sharp-cornered (matches a real metal mount plate).
 * @property {string} [color]                 — color of the cutout interior
 *   (plate surface visible through the holes). Falls back to caseColor when
 *   unset. CSG result tags faces from the case body as group 0 and faces
 *   from the cutout volumes as group 1, so a 2-material array {caseMat,
 *   plateMat} renders the carved mesh with the right color in each region.
 * @property {Backlight} [backlight]
 *
 * @typedef {Object} Backlight
 *   Per-cutout LED glow — applies an emissive material to the cutout
 *   interior so light reads as bleeding up around each cap (the cap-to-
 *   plate gap). Only meaningful when topFrame is set.
 * @property {boolean} [enabled=true]   — Master switch.
 * @property {string} [color="#ffffff"] — Base emissive color (solid mode).
 * @property {number} [intensity=0.8]   — Emissive intensity 0..3 (>1 reads as
 *   real LED hot-spot; the case gets a subtle bounce light from the cutouts).
 * @property {"solid"|"breathe"|"rainbow"|"wave"} [pattern="solid"]
 *   - "solid"   — constant color glow.
 *   - "breathe" — sinusoidal pulse on emissiveIntensity.
 *   - "rainbow" — emissive color cycles through full hue spectrum.
 *   - "wave"    — color shifts in a moving wave along the layout (uses
 *                 cutout center positions to phase-shift each face).
 * @property {number} [speed=1.0]       — Animation speed multiplier.
 * @property {number} [bloom=0]         — 0..2, multiplier applied to base
 *   intensity for a "hot LED" feel. Uses high emissiveIntensity rather
 *   than postprocess bloom (so it works without an EffectComposer).
 *
 * @typedef {Object} MountSettings
 * @property {{x:number, y:number, z:number}} [offset] — Keycap group position offset
 * @property {number} [fit]          — 0-1.5, proportion of mount edge keys occupy
 * @property {number} [caseScale]    — Overall case size multiplier
 * @property {number} [extrudeWidth] — Case width multiplier (symmetric)
 */

export const CASE_PROFILE_SCHEMA_VERSION = "eletypes-caseProfile/1";
