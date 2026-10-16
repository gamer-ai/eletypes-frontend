/**
 * Regression tests for SEO landing pages:
 *  - src/content/landing.mjs      (content invariants: unique titles, SEO lengths, valid deep links)
 *  - scripts/build-landing.mjs   (prerender output: meta, JSON-LD, escaping, sitemap)
 *  - src/index.jsx                (every content slug has a matching React route)
 *
 * Run with: npm test (Node 20 built-in test runner, no extra dependencies).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES, SITE_URL, STATIC_ROUTES } from "../src/content/landing.mjs";
import { renderPage, renderSitemap } from "../scripts/build-landing.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Mirrors the allow-lists in src/services/landingParams.js — the contract
// between landing-page CTAs and the app. If the app accepts a new value,
// this test must be updated alongside it.
const VALID_PARAMS = {
  timer: ["15", "30", "60", "90"],
  lang: ["en", "cn"],
  mode: ["words", "sentence"],
  deck: ["GRE", "TOEFL", "CET6", "CET4"],
};

describe("landing content", () => {
  it("has 15 pages with unique slugs and titles", () => {
    assert.equal(PAGES.length, 15);
    assert.equal(new Set(PAGES.map((p) => p.slug)).size, 15);
    assert.equal(new Set(PAGES.map((p) => p.title)).size, 15);
  });

  it("every page meets basic SEO/content requirements", () => {
    for (const p of PAGES) {
      assert.ok(p.title.length > 0 && p.title.length <= 60, `${p.slug}: title length ${p.title.length}`);
      assert.ok(
        p.description.length > 0 && p.description.length <= 160,
        `${p.slug}: description length ${p.description.length}`
      );
      assert.ok(p.h1.length > 0, `${p.slug}: empty h1`);
      assert.ok(p.intro.length >= 2, `${p.slug}: intro too short`);
      assert.equal(p.faqs.length, 4, `${p.slug}: expected 4 FAQs`);
      for (const f of p.faqs) {
        assert.ok(f.q.length > 0 && f.a.length > 0, `${p.slug}: empty FAQ`);
      }
      assert.ok(p.cta.text.length > 0 && p.cta.href.length > 0, `${p.slug}: broken CTA`);
      assert.ok(p.related.length >= 1, `${p.slug}: no related links`);
      assert.ok(["en", "zh"].includes(p.lang), `${p.slug}: bad lang`);
    }
  });

  it("every CTA deep link uses params the app understands", () => {
    for (const p of PAGES) {
      const url = new URL(p.cta.href);
      assert.equal(url.origin + "/", SITE_URL + "/", `${p.slug}: CTA must stay on-site`);
      for (const [key, allowed] of Object.entries(VALID_PARAMS)) {
        const v = url.searchParams.get(key);
        if (v !== null) {
          assert.ok(
            allowed.includes(key === "deck" ? v.toUpperCase() : v),
            `${p.slug}: CTA has unsupported ?${key}=${v}`
          );
        }
      }
    }
  });
});

describe("build-landing prerender", () => {
  it("renders full HTML with meta, canonical and JSON-LD per page", () => {
    for (const p of PAGES) {
      const html = renderPage(p);
      const url = `${SITE_URL}/${p.slug}/`;
      assert.ok(html.includes(`<title>${p.title}</title>`), `${p.slug}: title`);
      assert.ok(html.includes(`<html lang="${p.htmlLang}">`), `${p.slug}: html lang`);
      assert.ok(html.includes(`<link rel="canonical" href="${url}" />`), `${p.slug}: canonical`);
      assert.ok(html.includes(`<h1>${p.h1}</h1>`), `${p.slug}: h1`);
      assert.ok(html.includes('name="twitter:card" content="summary_large_image"'), `${p.slug}: twitter card`);
      assert.ok(html.includes(`property="og:url" content="${url}"`), `${p.slug}: og:url`);

      const m = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
      assert.ok(m, `${p.slug}: missing JSON-LD`);
      const ld = JSON.parse(m[1]);
      assert.equal(ld["@type"], "FAQPage");
      assert.equal(ld.mainEntity.length, 4, `${p.slug}: JSON-LD question count`);
    }
  });

  it("escapes HTML special characters in copy (no broken markup / injection)", () => {
    const evil = {
      ...PAGES[0],
      title: "A & B <test>",
      h1: "A & B <test>",
      description: "x",
      intro: ["a<b>&c"],
      faqs: [{ q: "q?", a: "a&b" }],
      cta: { text: "go", href: "https://example.com/" },
      related: [],
    };
    const html = renderPage(evil);
    assert.ok(html.includes("A &amp; B &lt;test&gt;"));
    assert.ok(!html.includes("A & B <test>"));
    assert.ok(html.includes("a&lt;b&gt;&amp;c"));
  });

  it("renders a well-formed sitemap with all 18 URLs", () => {
    const xml = renderSitemap();
    assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    assert.equal(locs.length, STATIC_ROUTES.length + PAGES.length);
    for (const r of STATIC_ROUTES) {
      assert.ok(locs.includes(`${SITE_URL}${r}`), `sitemap missing ${r}`);
    }
    for (const p of PAGES) {
      assert.ok(locs.includes(`${SITE_URL}/${p.slug}/`), `sitemap missing ${p.slug}`);
    }
  });
});

describe("router wiring", () => {
  it("every content slug has a matching React route before the /* catch-all", () => {
    const src = readFileSync(join(ROOT, "src/index.jsx"), "utf8");
    for (const p of PAGES) {
      assert.ok(src.includes(`path="/${p.slug}"`), `missing route for /${p.slug}`);
    }
    assert.ok(src.includes('path="/*"'), "catch-all route must still exist");
    // All landing routes must be declared before the catch-all, or they never match.
    const catchAllAt = src.indexOf('path="/*"');
    for (const p of PAGES) {
      assert.ok(src.indexOf(`path="/${p.slug}"`) < catchAllAt, `/${p.slug} declared after catch-all`);
    }
  });
});
