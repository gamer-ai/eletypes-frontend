/**
 * editorialChrome — mounts the Editorial chrome only when the Editorial theme
 * is active. Everything visual lives in src/style/editorial.js scoped under
 * `body.editorial`; this module just toggles that class.
 */

export const EDITORIAL_LABEL = "Editorial";

export const isEditorialTheme = (theme) => theme?.label === EDITORIAL_LABEL;

export const applyEditorialBodyClass = (theme) => {
  if (typeof document === "undefined") return;
  document.body.classList.toggle("editorial", isEditorialTheme(theme));
};
