// Build-time static prerender for SEO landing pages.
// Runs AFTER `vite build`: reads src/content/landing.mjs and emits
//   build/<slug>/index.html   (full meta + content + FAQ JSON-LD, crawler-ready)
//   build/sitemap.xml         (landing pages + core routes)
// Zero dependencies, Node 20 compatible. Static files take precedence over the
// SPA fallback on both Netlify (_redirects) and Firebase hosting (rewrites),
// so these URLs serve real HTML to crawlers and users alike.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES, SITE_URL, LAST_MOD, STATIC_ROUTES } from "../src/content/landing.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD = join(ROOT, "build");

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const CSS = `
:root{--bg:#0a0a0f;--panel:#12121a;--text:#e9e9ef;--muted:#9a9aad;--accent:#6ec6ff;--line:#23232e}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;line-height:1.75;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.wrap{max-width:760px;margin:0 auto;padding:0 22px}
header.site{border-bottom:1px solid var(--line);padding:18px 0;margin-bottom:44px}
header.site .wrap{display:flex;align-items:center;justify-content:space-between}
.brand{font-weight:700;font-size:20px;letter-spacing:.5px;color:var(--text)}
.brand:hover{text-decoration:none}
nav.links a{margin-left:22px;font-size:14px;color:var(--muted)}
nav.links a:hover{color:var(--accent)}
main{padding-bottom:20px}
h1{font-size:clamp(30px,5vw,44px);line-height:1.25;margin:0 0 26px;letter-spacing:-.5px}
.lede{color:var(--muted);font-size:17px;margin-bottom:8px}
article p{margin:18px 0;font-size:16.5px;color:#d5d5de}
.cta{margin:38px 0;padding:30px;background:var(--panel);border:1px solid var(--line);border-radius:14px;text-align:center}
.cta a.btn{display:inline-block;background:var(--accent);color:#06121f;font-weight:700;font-size:18px;padding:14px 38px;border-radius:10px}
.cta a.btn:hover{text-decoration:none;filter:brightness(1.08)}
.cta .note{margin-top:12px;font-size:13.5px;color:var(--muted)}
h2{font-size:23px;margin:46px 0 6px}
.faq details{background:var(--panel);border:1px solid var(--line);border-radius:10px;margin:12px 0;padding:16px 20px}
.faq summary{cursor:pointer;font-weight:600;font-size:16px}
.faq details p{margin:10px 0 2px;font-size:15px;color:#cfcfd8}
.related ul{list-style:none;margin-top:14px}
.related li{margin:10px 0}
.related li a{font-size:16px}
footer.site{border-top:1px solid var(--line);margin-top:60px;padding:26px 0 46px;color:var(--muted);font-size:13.5px}
footer.site .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
@media(max-width:560px){nav.links a{margin-left:14px}}
`;

const faqJsonLd = (page) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: page.faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const renderPage = (page) => {
  const url = `${SITE_URL}/${page.slug}/`;
  const labels =
    page.lang === "zh"
      ? { faq: "常见问题", related: "继续探索", nav: ["打字测试", "单词卡", "键盘实验室"] }
      : { faq: "Frequently asked questions", related: "Keep exploring", nav: ["Typing test", "Vocab cards", "Keyboard Lab"] };
  return `<!DOCTYPE html>
<html lang="${page.htmlLang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Eletypes" />
<meta property="og:title" content="${esc(page.title)}" />
<meta property="og:description" content="${esc(page.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE_URL}/logo512.png" />
<meta property="og:locale" content="${page.ogLocale}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(page.title)}" />
<meta name="twitter:description" content="${esc(page.description)}" />
<meta name="twitter:image" content="${SITE_URL}/logo512.png" />
<script type="application/ld+json">${JSON.stringify(faqJsonLd(page))}</script>
<style>${CSS}</style>
</head>
<body>
<header class="site"><div class="wrap">
<a class="brand" href="${SITE_URL}/">Ele Types</a>
<nav class="links"><a href="${SITE_URL}/">${labels.nav[0]}</a><a href="${SITE_URL}/vocabulary/cet4/">${labels.nav[1]}</a><a href="${SITE_URL}/keyboardlab">${labels.nav[2]}</a></nav>
</div></header>
<main class="wrap">
<h1>${esc(page.h1)}</h1>
<article>
${page.intro.map((p) => `<p>${esc(p)}</p>`).join("\n")}
</article>
<div class="cta">
<a class="btn" href="${esc(page.cta.href)}">${esc(page.cta.text)}</a>
<p class="note">${page.lang === "zh" ? "免费 · 免注册 · 无广告" : "Free · No sign-up · No ads"}</p>
</div>
<section class="faq">
<h2>${labels.faq}</h2>
${page.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("\n")}
</section>
<section class="related">
<h2>${labels.related}</h2>
<ul>
${page.related.map((r) => `<li><a href="${esc(r.href)}">${esc(r.label)}</a></li>`).join("\n")}
</ul>
</section>
</main>
<footer class="site"><div class="wrap">
<span>© 2026 Eletypes — elegant typing, open source (GPL-3.0)</span>
<span><a href="https://github.com/HSH4RK/eletypes-frontend">GitHub</a></span>
</div></footer>
</body>
</html>
`;
};

export const renderSitemap = () => {
  const urls = [
    ...STATIC_ROUTES.map((r) => `${SITE_URL}${r === "/" ? "/" : r}`),
    ...PAGES.map((p) => `${SITE_URL}/${p.slug}/`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc><lastmod>${LAST_MOD}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`;
};

export const main = () => {
  let count = 0;
  for (const page of PAGES) {
    const outDir = join(BUILD, page.slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), renderPage(page), "utf8");
    count++;
  }
  writeFileSync(join(BUILD, "sitemap.xml"), renderSitemap(), "utf8");

  console.log(`[build-landing] rendered ${count} landing pages + sitemap.xml -> ${BUILD}`);
  return count;
};

// Only run when executed directly (`node scripts/build-landing.mjs`);
// importing this module (e.g. in tests) must not touch the filesystem.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
