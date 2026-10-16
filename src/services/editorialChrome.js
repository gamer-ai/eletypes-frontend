/**
 * editorialChrome — mounts the editorial design-language chrome when the
 * active theme opts in via `chrome: "editorial"` (Editorial, Ink, Moss, Clay).
 * Everything visual lives in src/style/editorial.js scoped under
 * `body.editorial`; this module just toggles that class.
 * The label fallback keeps older saved themes working.
 */

export const EDITORIAL_LABEL = "Editorial";
export const EDITORIAL_CHROME = "editorial";

export const isEditorialTheme = (theme) =>
  theme?.chrome === EDITORIAL_CHROME || theme?.label === EDITORIAL_LABEL;

export const applyEditorialBodyClass = (theme) => {
  if (typeof document === "undefined") return;
  document.body.classList.toggle("editorial", isEditorialTheme(theme));
};
