import React, { useState, useCallback, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import { Tooltip } from "@mui/material";
import { getUserName, getUserTag } from "../../services/userIdentity";
import { getRank, getBestEffectiveWpm } from "../../services/badges";
import { useLocale } from "../../context/LocaleContext";
import ProfileModal from "./ProfileModal";

const BANNER_DISMISS_KEY = "eletypes-banner-dismissed";
// Bump when the active banner set changes so previously-dismissed users see
// the new headline.
const BANNER_VERSION = "banners-v6";

// Banner items shown in the header ticker. Old items kept in ALL_NEWS_KEYS
// for the profile modal so the news log doesn't lose history.
export const BANNER_KEYS = [
  {
    id: "creator-recruit",
    bannerTextKey: "banner_creator_recruit",
    fullTextKey: "banner_creator_recruit_full",
    // No top-level external link — clicking the short banner just opens
    // the News tab where the full text includes the actual form CTA.
    // Deliberately doesn't name or link the destination product brand;
    // the pitch reads as "eletypes is building a content aggregator",
    // and creator outreach happens purely through the recruitment form.
    highlights: [
      // Internal target — clicking opens the Profile modal on the
      // Creators tab, which carries the full pitch + FAQ + an explicit
      // CTA out to the Tencent Survey. We deliberately route through
      // the in-app pitch first rather than jumping straight to the
      // external form, so creators see context before deciding.
      { placeholder: "提交友链申请", link: "profile-tab:creators" },
      { placeholder: "submit your link", link: "profile-tab:creators" },
    ],
  },
  {
    id: "customization",
    bannerTextKey: "banner_customization",
    fullTextKey: "banner_customization_full",
    highlights: [
      { placeholder: "Custom Themes" },
      { placeholder: "Custom Words" },
      { placeholder: "自定义主题" },
      { placeholder: "自定义词组" },
    ],
  },
];

// All news items including old ones — used by profile modal news tab
export const ALL_NEWS_KEYS = [
  ...BANNER_KEYS,
  {
    id: "keyboard-lab",
    bannerTextKey: "banner_keyboard_lab",
    fullTextKey: "banner_keyboard_lab_full",
    link: "/keyboardlab",
    highlights: [
      {
        placeholder: "Keyboard Lab",
        link: "/keyboardlab",
      },
      {
        placeholder: "键盘实验室",
        link: "/keyboardlab",
      },
    ],
  },
  {
    id: "leaderboard",
    bannerTextKey: "banner_leaderboard",
    fullTextKey: "banner_leaderboard_full",
    highlights: [{ placeholder: "Leaderboard" }, { placeholder: "排行榜" }, { placeholder: "stats" }, { placeholder: "数据分析" }],
  },
  {
    id: "roblox",
    bannerTextKey: "banner_roblox",
    fullTextKey: "banner_roblox_full",
    link: "https://www.roblox.com/games/89217440428554/Type",
    highlights: [
      {
        placeholder: "Type!",
        link: "https://www.roblox.com/games/89217440428554/Type",
      },
    ],
  },
];

const isDismissed = () => {
  try {
    const stored = localStorage.getItem(BANNER_DISMISS_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return parsed.version === BANNER_VERSION && parsed.dismissed === true;
  } catch {
    return false;
  }
};

const renderHighlighted = (text, highlights, theme) => {
  const parts = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    let earliest = null;
    let earliestIdx = remaining.length;
    let matchedHighlight = null;
    for (const h of highlights) {
      const pattern = `{${h.placeholder}}`;
      const idx = remaining.indexOf(pattern);
      if (idx !== -1 && idx < earliestIdx) {
        earliest = pattern;
        earliestIdx = idx;
        matchedHighlight = h;
      }
    }
    if (!earliest) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
    if (earliestIdx > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, earliestIdx)}</span>);
    }
    const label = matchedHighlight.placeholder;
    // A "profile-tab:<id>" pseudo-URL opens the Profile modal on the
    // named tab instead of navigating out. Useful for in-app CTAs
    // (e.g., the creator-recruit banner) where the destination is a
    // pitch page that lives inside this app, not an external link.
    // Rendered as <a href="#"> with a click handler rather than
    // <button> so the element flows inline inside the banner's flex
    // container exactly like the external-link case (button caused
    // a 3-line break because of its default inline-block layout).
    if (typeof matchedHighlight.link === "string" && matchedHighlight.link.startsWith("profile-tab:")) {
      const tab = matchedHighlight.link.slice("profile-tab:".length);
      parts.push(
        <a
          key={key++}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.dispatchEvent(
              new CustomEvent("eletypes-open-profile", { detail: { tab } })
            );
          }}
          style={{ color: theme.stats, textDecoration: "underline", fontWeight: 600, cursor: "pointer" }}
        >
          {label}
        </a>
      );
    } else if (matchedHighlight.link) {
      parts.push(
        <a key={key++} href={matchedHighlight.link} target="_blank" rel="noopener noreferrer"
          style={{ color: theme.stats, textDecoration: "underline", fontWeight: 600 }}>
          {label}
        </a>
      );
    } else {
      parts.push(
        <span key={key++} style={{ color: theme.stats, fontWeight: 600 }}>{label}</span>
      );
    }
    remaining = remaining.slice(earliestIdx + earliest.length);
  }
  return parts;
};

const Logo = ({
  isFocusedMode,
  theme,
  soundMode,
  toggleSoundMode,
  isMusicMode,
  toggleMusicMode,
  toggleFocusedMode,
  isUltraZenMode,
  toggleUltraZenMode,
  customThemes,
  onActivateTheme,
  onCreateTheme,
  onEditTheme,
  onDeleteTheme,
  customWordLists,
  activeWordListId,
  onActivateWordList,
  onDeactivateWordList,
  onCreateWordList,
  onEditWordList,
  onDeleteWordList,
  onImportWordLists,
}) => {
  const { t } = useLocale();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState("profile");
  const [cardVisible, setCardVisible] = useState(true);
  const [userName, setUserNameState] = useState(() => getUserName());
  const [dismissed, setDismissed] = useState(() => isDismissed());

  // Re-read rank when scores change (triggered by Stats.jsx after session)
  const [rankVersion, setRankVersion] = useState(0);
  useEffect(() => {
    const handler = () => setRankVersion((v) => v + 1);
    window.addEventListener("eletypes-score-updated", handler);
    return () => window.removeEventListener("eletypes-score-updated", handler);
  }, []);
  void rankVersion;
  const bestEffective = getBestEffectiveWpm();
  const rank = getRank(bestEffective);
  const newsCount = dismissed ? 0 : BANNER_KEYS.length;


  const dismissAll = useCallback(() => {
    setDismissed(true);
    localStorage.setItem(
      BANNER_DISMISS_KEY,
      JSON.stringify({ version: BANNER_VERSION, dismissed: true })
    );
  }, []);

  const openProfile = (tab) => {
    setProfileInitialTab(tab || "profile");
    setProfileOpen(true);
    if (tab === "news") dismissAll();
  };

  // Allow other components to request the profile modal open on a specific
  // tab without prop-drilling. Mirrors the score-updated event pattern.
  useEffect(() => {
    const handler = (e) => openProfile(e?.detail?.tab || "profile");
    window.addEventListener("eletypes-open-profile", handler);
    return () => window.removeEventListener("eletypes-open-profile", handler);
  }, []);

  const toggleCard = () => {
    setCardVisible(!cardVisible);
  };

  return (
    <>
      <div
        className="header"
        style={{ visibility: isFocusedMode ? "hidden" : "visible" }}
      >
        <div className="logo-row">
          <div className="logo-top">
            <h1 className="logo-title">
              <span className="logo-accent">Ele Types</span>{" "}
              <KeyboardAltIcon className="logo-icon" />
            </h1>
            <span className="user-greeting">
              {userName && `👋 ${userName}, `}
              {t("greeting_suffix")}
            </span>
          </div>
          {!dismissed && (
            <span className="header-banner">
              <span className="header-banner-prompt">&gt;</span>
              {BANNER_KEYS.map((banner, idx) => {
                const text = t(banner.bannerTextKey);
                return (
                  <span key={banner.id}>
                    {idx > 0 && <span className="header-banner-sep"> · </span>}
                    {theme ? renderHighlighted(text, banner.highlights, theme) : text}
                  </span>
                );
              })}
              <button className="header-banner-close" onClick={dismissAll}>
                <CloseIcon style={{ fontSize: "12px" }} />
              </button>
            </span>
          )}
        </div>
      </div>
      {theme && (
        <>
          {/* Profile button + name card area */}
          <div className="profile-area">
            {/* Keyboard Lab link */}
            <Tooltip title={t("keyboard_lab") || "Keyboard Lab"} placement="bottom">
              <a href="/keyboardlab" className="profile-btn" style={{ position: "relative", textDecoration: "none", marginRight: "12px" }}>
                <span className="profile-bracket">[</span>
                <DesignServicesIcon style={{ fontSize: "16px" }} />
                <span className="profile-bracket">]</span>
                <span style={{
                  position: "absolute", top: "-4px", right: "-8px",
                  fontSize: "7px", fontWeight: 700, letterSpacing: "0.5px",
                  textTransform: "uppercase", lineHeight: 1,
                  padding: "1px 3px", borderRadius: "3px",
                  background: "#4a90d9", color: "#fff",
                }}>beta</span>
              </a>
            </Tooltip>

            {/* Name card — slides in/out from the right */}
            <div className={`namecard ${cardVisible ? "namecard-visible" : "namecard-hidden"}`}>
              <div
                className="namecard-header"
                onClick={() => openProfile("profile")}
              >
                <span className="namecard-rank">
                  <span style={{ color: theme.textTypeBox }}>[</span>
                  <span style={{ color: rank.color, fontWeight: 700 }}>{rank.icon}</span>
                  <span style={{ color: theme.textTypeBox }}>]</span>
                </span>
                <div className="namecard-info">
                  <span className="namecard-name" style={{ color: theme.text }}>
                    {userName || t("click_to_set_name")}
                    <span className="namecard-tag" style={{ color: theme.textTypeBox }}>
                      {getUserTag()}
                    </span>
                  </span>
                  <span className="namecard-title" style={{ color: rank.color }}>
                    {t(rank.nameKey)}
                  </span>
                </div>
              </div>
            </div>

            {/* Slide toggle */}
            <button className="namecard-slide-btn" onClick={toggleCard}>
              <span style={{ color: theme.stats }}>
                {cardVisible ? "›" : "‹"}
              </span>
            </button>

            {/* Profile button */}
            <Tooltip title={t("profile")} placement="left">
              <button className="profile-btn" onClick={() => openProfile(newsCount > 0 ? "news" : "site")}>
                <span className="profile-bracket">[</span>
                <PersonOutlineIcon style={{ fontSize: "16px" }} />
                <span className="profile-bracket">]</span>
                {newsCount > 0 && (
                  <span className="profile-badge">{newsCount}</span>
                )}
              </button>
            </Tooltip>
          </div>

          <ProfileModal
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            theme={theme}
            onNameChange={(newName) => setUserNameState(newName)}
            isFocusedMode={isFocusedMode}
            toggleFocusedMode={toggleFocusedMode}
            soundMode={soundMode}
            toggleSoundMode={toggleSoundMode}
            isMusicMode={isMusicMode}
            toggleMusicMode={toggleMusicMode}
            isUltraZenMode={isUltraZenMode}
            toggleUltraZenMode={toggleUltraZenMode}
            initialTab={profileInitialTab}
            onNewsViewed={dismissAll}
            unviewedNewsCount={newsCount}
            customThemes={customThemes}
            onActivateTheme={onActivateTheme}
            onCreateTheme={onCreateTheme}
            onEditTheme={onEditTheme}
            onDeleteTheme={onDeleteTheme}
            customWordLists={customWordLists}
            activeWordListId={activeWordListId}
            onActivateWordList={onActivateWordList}
            onDeactivateWordList={onDeactivateWordList}
            onCreateWordList={onCreateWordList}
            onEditWordList={onEditWordList}
            onDeleteWordList={onDeleteWordList}
            onImportWordLists={onImportWordLists}
          />
        </>
      )}
    </>
  );
};

export default Logo;
