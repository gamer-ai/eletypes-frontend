/**
 * Regression tests for landing-page deep links (src/services/landingParams.js).
 *
 * These params are applied at App boot, so a bug here breaks the main app for
 * every visitor — not just landing-page traffic. Run with: npm test
 * (Node 20 built-in test runner, no extra dependencies).
 */

import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { applyLandingParams } from "../src/services/landingParams.js";
import { PAGES } from "../src/content/landing.mjs";

/** Install a fresh fake window per test. Returns { store, replaced }. */
const mockWindow = (search) => {
  const store = {};
  const replaced = [];
  globalThis.window = {
    location: { search, pathname: "/" },
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => {
        store[k] = String(v);
      },
      removeItem: (k) => {
        delete store[k];
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
    },
    history: {
      replaceState: (...args) => {
        replaced.push(args);
      },
    },
  };
  return { store, replaced };
};

describe("applyLandingParams", () => {
  beforeEach(() => {
    delete globalThis.window;
  });

  it("does nothing when there are no query params", () => {
    const { store, replaced } = mockWindow("");
    assert.equal(applyLandingParams(), false);
    assert.deepEqual(store, {});
    assert.equal(replaced.length, 0);
  });

  it("yields to challenge links (?s=...)", () => {
    const { store } = mockWindow("?s=abc123&t=60&l=cn");
    assert.equal(applyLandingParams(), false);
    assert.deepEqual(store, {});
  });

  it("applies a valid timer preset", () => {
    const { store, replaced } = mockWindow("?timer=60");
    assert.equal(applyLandingParams(), true);
    assert.equal(store["timer-constant"], "60");
    assert.equal(replaced.length, 1);
    assert.equal(replaced[0][2], "/"); // query string cleaned
  });

  it("ignores an invalid timer value", () => {
    const { store } = mockWindow("?timer=999");
    assert.equal(applyLandingParams(), true); // param seen, URL still cleaned
    assert.ok(!("timer-constant" in store));
  });

  it("maps lang=en|cn to the app's language keys", () => {
    let ctx = mockWindow("?lang=cn");
    applyLandingParams();
    assert.equal(ctx.store["language"], '"CHINESE_MODE"');

    ctx = mockWindow("?lang=en");
    applyLandingParams();
    assert.equal(ctx.store["language"], '"ENGLISH_MODE"');

    ctx = mockWindow("?lang=xx");
    applyLandingParams();
    assert.ok(!("language" in ctx.store));
  });

  it("maps mode=words|sentence to the app's game-mode keys", () => {
    let ctx = mockWindow("?mode=sentence");
    applyLandingParams();
    assert.equal(ctx.store["game-mode"], '"SENTENCE_MODE"');

    ctx = mockWindow("?mode=words");
    applyLandingParams();
    assert.equal(ctx.store["game-mode"], '"WORD_MODE"');
  });

  it("deck=cet4 opens Words Card mode with the CET-4 deck preselected", () => {
    const { store } = mockWindow("?deck=cet4");
    assert.equal(applyLandingParams(), true);
    assert.equal(store["DictionaryCatalog"], '{"CET4":["a"]}');
    assert.equal(store["IsInWordsCardMode"], "true");
    assert.equal(store["game-mode"], '"WORD_MODE"');
  });

  it("ignores decks the product does not ship (e.g. IELTS)", () => {
    const { store } = mockWindow("?deck=IELTS");
    applyLandingParams();
    assert.ok(!("DictionaryCatalog" in store));
    assert.ok(!("IsInWordsCardMode" in store));
  });

  it("applies combined params at once", () => {
    const { store } = mockWindow("?timer=90&lang=cn&mode=sentence");
    assert.equal(applyLandingParams(), true);
    assert.equal(store["timer-constant"], "90");
    assert.equal(store["language"], '"CHINESE_MODE"');
    assert.equal(store["game-mode"], '"SENTENCE_MODE"');
  });

  it("every landing-page CTA deep link applies cleanly", () => {
    for (const page of PAGES) {
      const url = new URL(page.cta.href);
      const search = url.search;
      assert.ok(search.length > 1, `${page.slug}: CTA has no query params`);
      const { store } = mockWindow(search);
      let applied;
      assert.doesNotThrow(() => {
        applied = applyLandingParams();
      }, `${page.slug}: CTA deep link threw`);
      if (url.searchParams.has("s")) {
        // Seeded challenge-style CTA: handled by parseChallengeParams,
        // applyLandingParams must yield.
        assert.equal(applied, false, `${page.slug}: must yield to challenge link`);
      } else {
        assert.equal(applied, true, `${page.slug}: CTA not applied`);
        assert.ok(Object.keys(store).length > 0, `${page.slug}: CTA set nothing`);
      }
    }
  });
});
