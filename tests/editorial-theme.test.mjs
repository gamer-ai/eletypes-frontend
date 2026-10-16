/**
 * Regression tests for the Editorial theme (style PR).
 *
 * The bar for this PR: adding one theme must not change anything for the
 * other 19. These tests lock that in:
 *  - the original 19 built-ins keep their exact order and count; Editorial
 *    is appended last; the default theme is still Dark
 *  - every theme (old and new) defines every key the app reads
 *  - no other theme leaks the editorial palette
 *  - the chrome helper only activates for the Editorial label, and the
 *    body-class toggle behaves (incl. no-DOM no-op for SSR/build)
 *  - EVERY chrome override selector is scoped under `body.editorial`
 *    (a single unscoped rule would restyle other themes => fail)
 *  - the footer keeps exactly one hairline (regression: .bottomBar is on
 *    both the wrapper div and the MUI AppBar inside it)
 *  - custom themes: cloning from Editorial copies the colors but not the
 *    chrome (label-gated); Editorial still resolves by label on reload
 *
 * Run with: npm test (Node 20 built-in test runner, no extra dependencies).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  themesOptions,
  defaultTheme,
  darkTheme,
  editorialTheme,
} from "../src/style/theme.js";
import {
  isEditorialTheme,
  applyEditorialBodyClass,
  EDITORIAL_LABEL,
} from "../src/services/editorialChrome.js";
import {
  newThemeFrom,
  resolveTheme,
  isCustomTheme,
  buildGroupedOptions,
} from "../src/style/customThemes.js";

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

// The 19 built-ins in their original order — the PR must not reorder,
// remove, or rename any of them; Editorial is appended last.
const ORIGINAL_19_LABELS = [
  "Dark",
  "Tokyo Night",
  "Aluminium",
  "Piano",
  "Terminal",
  "Nintendo",
  "Cyber",
  "Edgerunner",
  "EVA-01",
  "Steam",
  "Araki Nobuyoshi",
  "Hero",
  "Cool Kid",
  "Budapest",
  "Light",
  "Tranquiluxe",
  "Lumiflex",
  "Opulento",
  "Velustro",
];

describe("editorial theme — no regressions for existing themes", () => {
  it("appends Editorial last without touching the original 19", () => {
    const labels = themesOptions.map((o) => o.label);
    assert.equal(labels.length, 20);
    assert.deepEqual(labels.slice(0, 19), ORIGINAL_19_LABELS);
    assert.equal(labels[19], "Editorial");
  });

  it("default theme is still Dark", () => {
    assert.equal(defaultTheme.label, "Dark");
    assert.equal(defaultTheme, darkTheme);
  });

  it("every theme defines every key the app reads", () => {
    for (const opt of themesOptions) {
      for (const k of REQUIRED_THEME_KEYS) {
        assert.ok(
          opt.value[k] !== undefined && opt.value[k] !== "",
          `${opt.label}: theme.${k} is missing`
        );
      }
    }
  });

  it("no other theme leaks the editorial palette", () => {
    for (const opt of themesOptions) {
      if (opt.label === "Editorial") continue;
      assert.notEqual(
        opt.value.background,
        "#fafaf7",
        `${opt.label} uses the editorial paper`
      );
      assert.notEqual(
        opt.value.stats,
        "#ff3b00",
        `${opt.label} uses the editorial accent`
      );
    }
  });

  it("Editorial is flagged new and pinned above Built-in", () => {
    const entry = themesOptions.find((o) => o.label === "Editorial");
    assert.ok(entry, "Editorial missing from themesOptions");
    assert.equal(entry.isNew, true);
    const groups = buildGroupedOptions([], null);
    assert.equal(groups[0].label, "New");
    assert.deepEqual(
      groups[0].options.map((o) => o.label),
      ["Editorial"]
    );
    assert.equal(groups[1].label, "Built-in");
    assert.equal(groups[1].options.length, 19);
  });

  it("My Themes group still comes last when custom themes exist", () => {
    const groups = buildGroupedOptions(
      [{ id: "custom__x", label: "Mine" }],
      null
    );
    assert.deepEqual(
      groups.map((g) => g.label),
      ["New", "Built-in", "My Themes"]
    );
  });
});

describe("editorial theme — chrome activation", () => {
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

  it("applyEditorialBodyClass toggles body.editorial", () => {
    const classes = new Set();
    const fakeDocument = {
      body: {
        classList: {
          toggle: (cls, force) => {
            if (force) classes.add(cls);
            else classes.delete(cls);
          },
        },
      },
    };
    globalThis.document = fakeDocument;
    try {
      applyEditorialBodyClass(editorialTheme);
      assert.ok(classes.has("editorial"));
      applyEditorialBodyClass(darkTheme);
      assert.ok(!classes.has("editorial"));
    } finally {
      delete globalThis.document;
    }
  });

  it("applyEditorialBodyClass no-ops without a DOM (SSR/build safe)", () => {
    assert.equal(typeof document, "undefined");
    assert.doesNotThrow(() => applyEditorialBodyClass(editorialTheme));
  });
});

describe("editorial theme — chrome scoping", () => {
  const src = readFileSync(join(ROOT, "src/style/editorial.js"), "utf8");
  // only the CSS inside the createGlobalStyle template literal counts —
  // the surrounding JS (imports/exports) is not style output
  const marker = "createGlobalStyle`";
  const css = src.slice(src.indexOf(marker) + marker.length, src.lastIndexOf("`"));
  const code = css.replace(/\/\*[\s\S]*?\*\//g, ""); // strip comments

  it("every override selector is scoped under body.editorial", () => {
    const selectors = [];
    const ruleRe = /([^{}]+)\{[^}]*\}/g;
    let m;
    while ((m = ruleRe.exec(code)) !== null) {
      for (const sel of m[1].split(",")) {
        const s = sel.trim();
        if (s) selectors.push(s);
      }
    }
    assert.ok(selectors.length >= 20, `expected 20+ rules, got ${selectors.length}`);
    for (const s of selectors) {
      assert.ok(
        s.startsWith("body.editorial"),
        `unscoped selector would leak into other themes: ${s}`
      );
    }
  });

  it("footer keeps exactly one hairline (no double rule)", () => {
    assert.ok(
      code.includes("body.editorial .bottomBar .bottomBar"),
      "inner .bottomBar reset missing — the double hairline regresses"
    );
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

describe("editorial theme — custom theme compatibility", () => {
  it("cloning from Editorial copies colors but not the chrome", () => {
    const mine = newThemeFrom(editorialTheme, "My Paper");
    assert.ok(isCustomTheme(mine));
    assert.equal(mine.background, "#fafaf7");
    assert.equal(mine.stats, "#ff3b00");
    // label-gated: custom themes never pick up the editorial chrome
    assert.equal(isEditorialTheme(mine), false);
  });

  it("a custom theme deliberately named Editorial opts into the chrome", () => {
    const mine = newThemeFrom(darkTheme, "Editorial");
    assert.ok(isCustomTheme(mine));
    assert.equal(isEditorialTheme(mine), true);
  });

  it("Editorial resolves by label after a reload", () => {
    assert.equal(resolveTheme({ label: "Editorial" }, []), editorialTheme);
  });
});
