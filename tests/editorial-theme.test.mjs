/**
 * Regression tests for the Editorial theme (style PR).
 *
 * Guarantees:
 *  - the Editorial theme is registered and defines every key the app reads
 *  - the chrome helper only activates for the Editorial label
 *  - ALL chrome overrides are scoped under `body.editorial`, so no other
 *    theme can ever be affected by the editorial restyle
 *
 * Run with: npm test (Node 20 built-in test runner, no extra dependencies).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { themesOptions, editorialTheme } from "../src/style/theme.js";
import { isEditorialTheme, EDITORIAL_LABEL } from "../src/services/editorialChrome.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Every key the app reads off a theme object (grep theme.<key> in src/).
const REQUIRED_THEME_KEYS = [
  "label",
  "background",
  "text",
  "gradient",
  "title",
  "textTypeBox",
  "stats",
  "fontFamily",
];

describe("editorial theme", () => {
  it("is registered in the theme picker", () => {
    const entry = themesOptions.find((o) => o.label === "Editorial");
    assert.ok(entry, "Editorial missing from themesOptions");
    assert.equal(entry.value.label, "Editorial");
  });

  it("defines every key the app reads from a theme", () => {
    for (const k of REQUIRED_THEME_KEYS) {
      assert.ok(
        editorialTheme[k] !== undefined && editorialTheme[k] !== "",
        `editorialTheme.${k} is missing`
      );
    }
  });

  it("uses the editorial palette (paper / ink / accent)", () => {
    assert.equal(editorialTheme.background, "#fafaf7");
    assert.equal(editorialTheme.text, "#111111");
    assert.equal(editorialTheme.stats, "#ff3b00");
    assert.ok(
      editorialTheme.fontFamily.includes("Helvetica"),
      "editorial grotesque stack missing"
    );
  });

  it("chrome helper activates only for the Editorial label", () => {
    assert.equal(EDITORIAL_LABEL, "Editorial");
    assert.equal(isEditorialTheme(editorialTheme), true);
    assert.equal(isEditorialTheme({ label: "Dark" }), false);
    assert.equal(isEditorialTheme({ label: "editorial" }), false); // case-sensitive
    assert.equal(isEditorialTheme(null), false);
    assert.equal(isEditorialTheme(undefined), false);
  });

  it("every chrome override is scoped under body.editorial", () => {
    const src = readFileSync(join(ROOT, "src/style/editorial.js"), "utf8");
    const code = src.replace(/\/\*[\s\S]*?\*\//g, ""); // strip comments
    for (const sel of [
      ".logo-title",
      ".nav-item",
      ".nav-mode",
      ".submit-score-btn",
      ".modal-content",
      ".select",
      ".words",
      ".stats",
      ".rank-card",
    ]) {
      const unscoped = new RegExp(`(^|\\n)\\s*\\${sel} \\{`);
      assert.ok(
        !unscoped.test(code),
        `${sel} has an unscoped rule — it would leak into other themes`
      );
    }
    const scopedCount = (code.match(/body.editorial/g) || []).length;
    assert.ok(scopedCount >= 20, `expected 20+ scoped selectors, got ${scopedCount}`);
  });

  it("the three app shells mount the editorial styles conditionally", () => {
    for (const f of ["src/App.jsx", "src/pages/KeyboardLabPage.jsx", "src/pages/MarkdownPage.jsx"]) {
      const src = readFileSync(join(ROOT, f), "utf8");
      assert.ok(src.includes("EditorialStyles"), `${f}: EditorialStyles not mounted`);
      assert.ok(
        src.includes("isEditorialTheme(theme) && <EditorialStyles />"),
        `${f}: EditorialStyles not conditional on the theme`
      );
      assert.ok(src.includes("applyEditorialBodyClass(theme)"), `${f}: body class not toggled`);
    }
  });
});
