/**
 * LandingPage — SEO landing pages driven by src/content/landing.mjs.
 *
 * Crawlers and direct visitors get the build-time static HTML produced by
 * scripts/build-landing.mjs (full meta + FAQ JSON-LD, no JS needed).
 * This component covers in-app client-side navigation to the same URLs and
 * keeps document head in sync when it does.
 */

import React, { useEffect } from "react";
import { PAGES, SITE_URL } from "../../content/landing.mjs";
import "./landing.css";

const setMeta = (attr, key, value) => {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const syncHead = (page) => {
  const url = `${SITE_URL}/${page.slug}/`;
  document.title = page.title;
  document.documentElement.setAttribute("lang", page.htmlLang);
  setMeta("name", "description", page.description);
  setMeta("property", "og:title", page.title);
  setMeta("property", "og:description", page.description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", `${SITE_URL}/logo512.png`);
  setMeta("property", "og:locale", page.ogLocale);
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", page.title);
  setMeta("name", "twitter:description", page.description);
  setMeta("name", "twitter:image", `${SITE_URL}/logo512.png`);
  const prev = document.head.querySelector('script[data-landing-faq="1"]');
  if (prev) prev.remove();
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.landingFaq = "1";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
  document.head.appendChild(script);
  const canonical = document.head.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", url);
};

const LandingPage = ({ slug }) => {
  const page = PAGES.find((p) => p.slug === slug);

  useEffect(() => {
    if (!page) return;
    syncHead(page);
    return () => {
      document.title = "Ele Types";
      const faq = document.head.querySelector('script[data-landing-faq="1"]');
      if (faq) faq.remove();
    };
  }, [page]);

  if (!page) return null;
  const zh = page.lang === "zh";

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-wrap landing-header-inner">
          <a className="landing-brand" href={`${SITE_URL}/`}>
            Ele Types
          </a>
          <nav className="landing-nav">
            <a href={`${SITE_URL}/`}>{zh ? "打字测试" : "Typing test"}</a>
            <a href={`${SITE_URL}/vocabulary/cet4/`}>{zh ? "单词卡" : "Vocab cards"}</a>
            <a href={`${SITE_URL}/keyboardlab`}>{zh ? "键盘实验室" : "Keyboard Lab"}</a>
          </nav>
        </div>
      </header>
      <main className="landing-wrap">
        <h1>{page.h1}</h1>
        <article>
          {page.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
        <div className="landing-cta">
          <a className="landing-btn" href={page.cta.href}>
            {page.cta.text}
          </a>
          <p className="landing-note">{zh ? "免费 · 免注册 · 无广告" : "Free · No sign-up · No ads"}</p>
        </div>
        <section className="landing-faq">
          <h2>{zh ? "常见问题" : "Frequently asked questions"}</h2>
          {page.faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
        <section className="landing-related">
          <h2>{zh ? "继续探索" : "Keep exploring"}</h2>
          <ul>
            {page.related.map((r, i) => (
              <li key={i}>
                <a href={r.href}>{r.label}</a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="landing-footer">
        <div className="landing-wrap landing-footer-inner">
          <span>© 2026 Eletypes — elegant typing, open source (GPL-3.0)</span>
          <a href="https://github.com/HSH4RK/eletypes-frontend">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
