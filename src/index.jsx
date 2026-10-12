import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import KeyboardLabPage from "./pages/KeyboardLabPage";
import MarkdownPage from "./pages/MarkdownPage";

// SEO landing pages (src/content/landing.mjs). Lazy: only loaded on direct
// in-app navigation; crawlers/direct visits get build-time static HTML.
const LandingPage = lazy(() => import("./pages/landing/LandingPage"));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Suspense fallback={null}>
      <Routes>
        <Route path="/keyboardlab" element={<KeyboardLabPage />} />
        <Route path="/markdown" element={<MarkdownPage />} />
        <Route path="/typing-test/1-minute" element={<LandingPage slug="typing-test/1-minute" />} />
        <Route path="/typing-test/wpm-test" element={<LandingPage slug="typing-test/wpm-test" />} />
        <Route path="/typing-test/chinese" element={<LandingPage slug="typing-test/chinese" />} />
        <Route path="/vocabulary/cet4" element={<LandingPage slug="vocabulary/cet4" />} />
        <Route path="/vocabulary/toefl" element={<LandingPage slug="vocabulary/toefl" />} />
        <Route path="/monkeytype-alternative" element={<LandingPage slug="monkeytype-alternative" />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
