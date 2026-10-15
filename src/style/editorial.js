import { createGlobalStyle } from "styled-components";

/**
 * EditorialStyles — Editorial editorial chrome for Eletypes.
 *
 * Mounted only when the "Editorial" theme is active (see src/services/editorialChrome.js).
 * Everything is scoped under `body.editorial`, so all other themes are untouched —
 * this is the proposal the user reviews before deciding to migrate.
 *
 * Design language (from the brutalist/editorial design study):
 *  - Typography-led: grotesque stack, tight display tracking, micro uppercase labels
 *  - Hairline 1px rules instead of shadows / gradients / rounded cards
 *  - Sharp corners everywhere (border-radius: 0)
 *  - One accent (#ff3b00) reserved for stats, caret and active states
 *  - Restraint: decorative icons and pulse animations removed
 */

export const EditorialStyles = createGlobalStyle`
  body.editorial {
    font-family: 'Helvetica Neue', Helvetica, Arial, 'PingFang SC',
      'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    text-shadow: none;
    letter-spacing: 0;
  }

  /* ---------- header / wordmark ---------- */
  body.editorial .logo-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #111111;
    opacity: 1;
  }
  body.editorial .logo-accent {
    font-weight: 700;
  }
  body.editorial .logo-gant {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #686864;
    opacity: 1;
  }
  body.editorial .logo-icon {
    display: none;
  }
  body.editorial .header-banner {
    border-bottom: 1px solid #111111;
  }
  body.editorial .header-banner-prompt,
  body.editorial .header-banner-link {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  body.editorial .user-greeting {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #686864;
  }

  /* ---------- config bar / nav ---------- */
  body.editorial .nav-group-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: #686864;
    opacity: 1;
  }
  body.editorial .nav-group-items {
    border-radius: 0;
    border: 1px solid #111111;
    background: transparent;
  }
  body.editorial .nav-group-links .nav-group-items {
    border-color: transparent;
  }
  body.editorial .nav-item,
  body.editorial .nav-mode {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.55;
  }
  body.editorial .nav-item:hover,
  body.editorial .nav-mode:hover {
    opacity: 1;
  }
  body.editorial .nav-item-active,
  body.editorial .nav-mode-active {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #111111;
    opacity: 1;
    text-decoration: underline;
    text-underline-offset: 5px;
    text-decoration-thickness: 1px;
  }

  /* ---------- typing surface ---------- */
  body.editorial .words {
    font-weight: 400;
    letter-spacing: -0.01em;
  }
  body.editorial .stats,
  body.editorial .keyboard-stats {
    font-variant-numeric: tabular-nums;
  }

  /* ---------- buttons / inputs ---------- */
  body.editorial .submit-score-btn {
    border-radius: 0;
    border: 1px solid #111111;
    color: #111111;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 12px 22px;
    animation: none;
    box-shadow: none;
  }
  body.editorial .submit-score-btn:hover {
    background: #111111;
    color: #fafaf7;
    transform: none;
    animation: none;
    box-shadow: none;
  }
  body.editorial .restart-button button {
    border-radius: 0;
  }
  body.editorial .restart-button button:hover {
    transform: none;
  }
  body.editorial .select {
    border-radius: 0;
    border: 1px solid #111111;
    font-size: 12px;
    box-shadow: none;
  }
  body.editorial button {
    border-radius: 0;
  }

  /* ---------- overlays / cards ---------- */
  body.editorial .modal-content {
    border-radius: 0;
    border: 1px solid #111111;
    box-shadow: none;
  }
  body.editorial .modal-title {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  body.editorial .rank-card,
  body.editorial .badge-item,
  body.editorial .namecard {
    border-radius: 0;
    box-shadow: none;
    border: 1px solid #e2ded4;
  }
  body.editorial .profile-section-label,
  body.editorial .badge-category-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  body.editorial .profile-bracket {
    color: #686864;
  }

  /* ---------- footer ---------- */
  body.editorial .bottomBar {
    border-top: 1px solid #111111;
    padding-top: 12px;
  }
  body.editorial .profile-btn {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;
