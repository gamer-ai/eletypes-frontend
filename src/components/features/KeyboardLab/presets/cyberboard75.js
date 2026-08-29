/**
 * Cyberboard R2-inspired 75% ANSI preset.
 *
 * Right column differs from generic 75%:
 *   Row 0: Delete + Home (two keys, Home at top-right corner)
 *   Row 1: End (next to Backspace)
 *   Row 2: PgUp
 *   Row 3: PgDn
 *   Row 4: ↑ only (gap — no nav key beside arrow up)
 *   Row 5: ← ↓ → (with gap before ←, PgDn is above →)
 */

import { createPreset } from "../schema/boardLayout";

const R0 = 0, R1 = 1.25, R2 = 2.25, R3 = 3.25, R4 = 4.25, R5 = 5.25;
// Every inter-group gap in the F-row is the same: 0.24u (= 3× the cap-to-
// cap gap of 0.08). Groups: Esc | F1-F4 | F5-F8 | F9-F12 | Del-Home.
// Right column / arrow cluster land at 14.96 (only 0.04u left of the
// original 15, so wide keys keep close-to-standard widths).
const RC_LEFT = 13.96;   // Delete position
const RC = 14.96;        // Right column (Home, End, PgUp, PgDn) — aligned with ArrowRight

export default createPreset({
  name: "Cyberboard R2 75%",
  boardId: "cyberboard-75-ansi",
  formFactor: "75%",
  layoutStagger: "row-staggered",
  standard: "ANSI",
  keyboardType: "mechanical",
  description: "Cyberboard R2-inspired layout with Home at top-right corner",
  casePreset: "cyberboard-r3",
  visual: {
    keycapColor: "#1a1a2e",
    accentColor: "#2d2d5e",
    caseColor: "#0a0a18",
    theme: "cyberboard",
  },
  keys: [
    // ══ Row 0: Function row — Delete shifted left, Home at corner ══
    { id: "Escape",  keyName: "Escape",  label: "Esc",  x: 0,        y: R0, w: 1,    kind: "accent", cluster: "fn-row" },
    { id: "F1",      keyName: "F1",      label: "F1",   x: 1.24,     y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F2",      keyName: "F2",      label: "F2",   x: 2.24,     y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F3",      keyName: "F3",      label: "F3",   x: 3.24,     y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F4",      keyName: "F4",      label: "F4",   x: 4.24,     y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F5",      keyName: "F5",      label: "F5",   x: 5.48,     y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F6",      keyName: "F6",      label: "F6",   x: 6.48,     y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F7",      keyName: "F7",      label: "F7",   x: 7.48,     y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F8",      keyName: "F8",      label: "F8",   x: 8.48,     y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F9",      keyName: "F9",      label: "F9",   x: 9.72,     y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F10",     keyName: "F10",     label: "F10",  x: 10.72,    y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F11",     keyName: "F11",     label: "F11",  x: 11.72,    y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "F12",     keyName: "F12",     label: "F12",  x: 12.72,    y: R0, w: 1,    kind: "fn",     cluster: "fn-row" },
    { id: "Delete",  keyName: "Delete",  label: "Del",  x: RC_LEFT,  y: R0, w: 1,    kind: "nav",    cluster: "nav-col" },
    { id: "Home",    keyName: "Home",    label: "Home", x: RC,       y: R0, w: 1,    kind: "nav",    cluster: "nav-col" },

    // ══ Row 1: Number row — End next to Backspace ══
    { id: "Backquote",  keyName: "Backquote",  label: "`",    x: 0,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit1",     keyName: "Digit1",     label: "1",    x: 1,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit2",     keyName: "Digit2",     label: "2",    x: 2,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit3",     keyName: "Digit3",     label: "3",    x: 3,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit4",     keyName: "Digit4",     label: "4",    x: 4,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit5",     keyName: "Digit5",     label: "5",    x: 5,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit6",     keyName: "Digit6",     label: "6",    x: 6,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit7",     keyName: "Digit7",     label: "7",    x: 7,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit8",     keyName: "Digit8",     label: "8",    x: 8,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit9",     keyName: "Digit9",     label: "9",    x: 9,   y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Digit0",     keyName: "Digit0",     label: "0",    x: 10,  y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Minus",      keyName: "Minus",      label: "-",    x: 11,  y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Equal",      keyName: "Equal",      label: "=",    x: 12,  y: R1, w: 1,   kind: "alpha", cluster: "number-row" },
    { id: "Backspace",  keyName: "Backspace",  label: "Bksp", x: 13,     y: R1, w: 1.96, kind: "accent", cluster: "number-row" },
    { id: "End",        keyName: "End",        label: "End",  x: RC,  y: R1, w: 1,   kind: "nav",   cluster: "nav-col" },

    // ══ Row 2: QWERTY — PgUp in right column ══
    { id: "Tab",           keyName: "Tab",          label: "Tab",  x: 0,    y: R2, w: 1.5,  kind: "accent", cluster: "alpha" },
    { id: "KeyQ",          keyName: "KeyQ",         label: "Q",    x: 1.5,  y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyW",          keyName: "KeyW",         label: "W",    x: 2.5,  y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyE",          keyName: "KeyE",         label: "E",    x: 3.5,  y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyR",          keyName: "KeyR",         label: "R",    x: 4.5,  y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyT",          keyName: "KeyT",         label: "T",    x: 5.5,  y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyY",          keyName: "KeyY",         label: "Y",    x: 6.5,  y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyU",          keyName: "KeyU",         label: "U",    x: 7.5,  y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyI",          keyName: "KeyI",         label: "I",    x: 8.5,  y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyO",          keyName: "KeyO",         label: "O",    x: 9.5,  y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyP",          keyName: "KeyP",         label: "P",    x: 10.5, y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "BracketLeft",   keyName: "BracketLeft",  label: "[",    x: 11.5, y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "BracketRight",  keyName: "BracketRight", label: "]",    x: 12.5, y: R2, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "Backslash",     keyName: "Backslash",    label: "\\",   x: 13.5, y: R2, w: 1.46, kind: "alpha",  cluster: "alpha" },
    { id: "PageUp",        keyName: "PageUp",       label: "PgUp", x: RC,   y: R2, w: 1,    kind: "nav",    cluster: "nav-col" },

    // ══ Row 3: Home row — PgDn in right column ══
    { id: "CapsLock",   keyName: "CapsLock",   label: "Caps",  x: 0,     y: R3, w: 1.75, kind: "accent", cluster: "alpha" },
    { id: "KeyA",       keyName: "KeyA",       label: "A",     x: 1.75,  y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyS",       keyName: "KeyS",       label: "S",     x: 2.75,  y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyD",       keyName: "KeyD",       label: "D",     x: 3.75,  y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyF",       keyName: "KeyF",       label: "F",     x: 4.75,  y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyG",       keyName: "KeyG",       label: "G",     x: 5.75,  y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyH",       keyName: "KeyH",       label: "H",     x: 6.75,  y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyJ",       keyName: "KeyJ",       label: "J",     x: 7.75,  y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyK",       keyName: "KeyK",       label: "K",     x: 8.75,  y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyL",       keyName: "KeyL",       label: "L",     x: 9.75,  y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "Semicolon",  keyName: "Semicolon",  label: ";",     x: 10.75, y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "Quote",      keyName: "Quote",      label: "'",     x: 11.75, y: R3, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "Enter",      keyName: "Enter",      label: "Enter", x: 12.75, y: R3, w: 2.21, kind: "accent", cluster: "alpha" },
    { id: "PageDown",   keyName: "PageDown",   label: "PgDn",  x: RC,    y: R3, w: 1,    kind: "nav",    cluster: "nav-col" },

    // ══ Row 4: Shift row — ↑ flush with right Shift ══
    { id: "ShiftLeft",  keyName: "ShiftLeft",  label: "Shift", x: 0,     y: R4, w: 2.25, kind: "accent", cluster: "alpha" },
    { id: "KeyZ",       keyName: "KeyZ",       label: "Z",     x: 2.25,  y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyX",       keyName: "KeyX",       label: "X",     x: 3.25,  y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyC",       keyName: "KeyC",       label: "C",     x: 4.25,  y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyV",       keyName: "KeyV",       label: "V",     x: 5.25,  y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyB",       keyName: "KeyB",       label: "B",     x: 6.25,  y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyN",       keyName: "KeyN",       label: "N",     x: 7.25,  y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "KeyM",       keyName: "KeyM",       label: "M",     x: 8.25,  y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "Comma",      keyName: "Comma",      label: ",",     x: 9.25,  y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "Period",     keyName: "Period",      label: ".",     x: 10.25, y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "Slash",      keyName: "Slash",       label: "/",     x: 11.25, y: R4, w: 1,    kind: "alpha",  cluster: "alpha" },
    { id: "ShiftRight", keyName: "ShiftRight",  label: "Shift", x: 12.25, y: R4, w: 1.71, kind: "accent", cluster: "alpha" },
    { id: "ArrowUp",    keyName: "ArrowUp",     label: "↑",     x: 13.96, y: R4, w: 1,    kind: "arrow",  cluster: "arrow-cluster" },
    // No nav key at RC on this row — gap between ↑ and right edge

    // ══ Row 5: Bottom row — no AltRight; Fn + Ctrl flush with spacebar ══
    { id: "ControlLeft",  keyName: "ControlLeft",  label: "Ctrl", x: 0,     y: R5, w: 1.25, kind: "mod",    cluster: "bottom-row" },
    { id: "MetaLeft",     keyName: "MetaLeft",     label: "Win",  x: 1.25,  y: R5, w: 1.25, kind: "mod",    cluster: "bottom-row" },
    { id: "AltLeft",      keyName: "AltLeft",      label: "Alt",  x: 2.5,   y: R5, w: 1.25, kind: "mod",    cluster: "bottom-row" },
    { id: "Space",        keyName: "Space",        label: "",     x: 3.75,  y: R5, w: 6.25, kind: "accent", cluster: "bottom-row" },
    // AltRight intentionally omitted — Cyberboard R2 only has Fn + Ctrl on
    // the right of the spacebar (mirrors AltLeft's gap=0 against the bar).
    // Fn matches AltLeft's 1.25u width — symmetric with the left side of the
    // spacebar. ControlRight shifts right by 0.25 to stay flush with Fn.
    { id: "Fn",           keyName: "Fn",           label: "Fn",   x: 10,    y: R5, w: 1.25, kind: "mod",    cluster: "bottom-row" },
    { id: "ControlRight", keyName: "ControlRight", label: "Ctrl", x: 11.25, y: R5, w: 1.25, kind: "mod",    cluster: "bottom-row" },
    // Arrow cluster shifted left by 0.25 to match ArrowUp under it.
    { id: "ArrowLeft",    keyName: "ArrowLeft",    label: "←",    x: 12.96, y: R5, w: 1,    kind: "arrow",  cluster: "arrow-cluster" },
    { id: "ArrowDown",    keyName: "ArrowDown",    label: "↓",    x: 13.96, y: R5, w: 1,    kind: "arrow",  cluster: "arrow-cluster" },
    { id: "ArrowRight",   keyName: "ArrowRight",   label: "→",    x: 14.96, y: R5, w: 1,    kind: "arrow",  cluster: "arrow-cluster" },
  ],
});
