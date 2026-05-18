import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton as MuiIconButton,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { ENGLISH_MODE, CHINESE_MODE } from "../../constants/Constants";
import {
  parseCustomWordsText,
  exportWordListsToJsonString,
  parseImportedWordListsJson,
  downloadJsonFile,
  buildExportFilename,
} from "../../scripts/customWords";
import { getUserName, setUserName, getUserTag } from "../../services/userIdentity";
import BadgeDisplay from "../features/Badges/BadgeDisplay";
import StatsPanel from "../features/Stats/StatsPanel";
import LeaderboardPanel from "../features/Leaderboard/LeaderboardPanel";
import { useLocale } from "../../context/LocaleContext";
import { ALL_NEWS_KEYS } from "./Logo";
import { useLabTranslation } from "../features/KeyboardLab/i18n/useLabTranslation";

const renderNewsHighlighted = (text, highlights, theme) => {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    let earliest = null;
    let earliestIdx = remaining.length;
    let matchedHighlight = null;

    for (const h of highlights) {
      // Match both {placeholder} and plain "placeholder" in full text
      const patterns = [`{${h.placeholder}}`, `"${h.placeholder}"`];
      for (const pattern of patterns) {
        const idx = remaining.indexOf(pattern);
        if (idx !== -1 && idx < earliestIdx) {
          earliest = pattern;
          earliestIdx = idx;
          matchedHighlight = h;
        }
      }
      // Also match the plain placeholder word
      const plainIdx = remaining.indexOf(h.placeholder);
      if (plainIdx !== -1 && plainIdx < earliestIdx) {
        earliest = h.placeholder;
        earliestIdx = plainIdx;
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
    if (matchedHighlight.link) {
      parts.push(
        <a
          key={key++}
          href={matchedHighlight.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.stats, textDecoration: "underline", fontWeight: 600 }}
        >
          {label}
        </a>
      );
    } else {
      parts.push(
        <span key={key++} style={{ color: theme.stats, fontWeight: 600 }}>
          {label}
        </span>
      );
    }

    remaining = remaining.slice(earliestIdx + earliest.length);
  }

  return parts;
};

const TAB_PROFILE = "profile";
const TAB_STATS = "stats";
const TAB_LEADERBOARD = "leaderboard";
const TAB_LAB = "lab";
const TAB_NEWS = "news";
const TAB_SITE = "site";
const TAB_THEMES = "themes";
const TAB_WORDS = "wordlists";
const TAB_CREATORS = "creators";

// External survey URL for friend-link submissions. Lives in this module so
// both the tab CTA and the (optionally) banner-driven highlight point at the
// same URL — swap once and everything updates.
const CREATOR_FORM_URL = "https://wj.qq.com/s2/26719983/89d7/";

const ProfileModal = ({
  open,
  onClose,
  theme,
  onNameChange,
  isFocusedMode,
  toggleFocusedMode,
  soundMode,
  toggleSoundMode,
  isMusicMode,
  toggleMusicMode,
  isUltraZenMode,
  toggleUltraZenMode,
  initialTab,
  onNewsViewed,
  unviewedNewsCount,
  customThemes = [],
  onActivateTheme,
  onCreateTheme,
  onEditTheme,
  onDeleteTheme,
  customWordLists = [],
  activeWordListId,
  onActivateWordList,
  onDeactivateWordList,
  onCreateWordList,
  onEditWordList,
  onDeleteWordList,
  onImportWordLists,
}) => {
  const { locale, setLocale, t } = useLocale();
  const tLab = useLabTranslation();
  const [activeTab, setActiveTab] = useState(TAB_PROFILE);
  const importFileInputRef = useRef(null);
  const [importMessage, setImportMessage] = useState("");

  // Auto-dismiss the import status message after a few seconds so a stale
  // success line doesn't linger after the user starts editing/deleting the
  // imported list. Also wipe it on modal close.
  React.useEffect(() => {
    if (!importMessage) return;
    const timer = setTimeout(() => setImportMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [importMessage]);

  React.useEffect(() => {
    if (!open) setImportMessage("");
  }, [open]);

  // If the list count drops while a success message is showing, clear it —
  // the message now contradicts what's on screen.
  const wordListCountRef = useRef((customWordLists || []).length);
  React.useEffect(() => {
    const count = (customWordLists || []).length;
    if (count < wordListCountRef.current && importMessage) {
      setImportMessage("");
    }
    wordListCountRef.current = count;
  }, [customWordLists, importMessage]);

  const handleExportSingleWordList = (wl) => {
    downloadJsonFile(buildExportFilename(wl), exportWordListsToJsonString(wl));
  };

  const handleExportAllWordLists = () => {
    if (!customWordLists || customWordLists.length === 0) return;
    downloadJsonFile(
      buildExportFilename(customWordLists),
      exportWordListsToJsonString(customWordLists)
    );
  };

  const handleImportClick = () => {
    setImportMessage("");
    importFileInputRef.current && importFileInputRef.current.click();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    // Reset so picking the same file twice still fires onChange.
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const lists = parseImportedWordListsJson(text, customWordLists);
      if (onImportWordLists) {
        const imported = onImportWordLists(lists);
        if (imported && imported.length > 0) {
          setImportMessage(t("custom_words_import_success", imported.length));
        }
      }
    } catch (err) {
      const code = err && err.message;
      const key =
        code === "invalid_json"
          ? "custom_words_import_error_json"
          : code === "unknown_format"
          ? "custom_words_import_error_format"
          : code === "no_lists"
          ? "custom_words_import_error_empty"
          : "custom_words_import_error_generic";
      setImportMessage(t(key));
    }
  };

  // Force fresh data when modal opens
  const [refreshKey, setRefreshKey] = useState(0);
  React.useEffect(() => {
    if (open) {
      setRefreshKey((k) => k + 1);
      if (initialTab) setActiveTab(initialTab);
    }
  }, [open, initialTab]);
  const [name, setName] = useState(() => getUserName());
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const handleSave = () => {
    const trimmed = name.trim();
    if (trimmed) {
      setUserName(trimmed);
      setName(trimmed);
      if (onNameChange) onNameChange(trimmed);
    }
    setIsEditing(false);
    setSavedMessage(t("name_updated"));
    setTimeout(() => setSavedMessage(""), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
    e.stopPropagation();
  };

  const tabStyle = (isActive) => ({
    background: "transparent",
    border: "none",
    borderBottom: isActive
      ? `2px solid ${theme.stats}`
      : `2px solid transparent`,
    color: isActive ? theme.stats : theme.textTypeBox,
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: theme.fontFamily,
    fontWeight: isActive ? 600 : 400,
    transition: "all 0.2s",
  });

  const toggleRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: `1px solid ${theme.textTypeBox}20`,
  };

  const toggleLabelStyle = {
    fontSize: "14px",
    color: theme.text,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
      }}
      PaperProps={{
        style: {
          background: theme.background,
          color: theme.text,
          borderRadius: "8px",
          border: `1px solid ${theme.textTypeBox}33`,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px 0",
          borderBottom: `1px solid ${theme.textTypeBox}30`,
        }}
      >
        <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
          <button
            style={tabStyle(activeTab === TAB_PROFILE)}
            onClick={() => setActiveTab(TAB_PROFILE)}
          >
            {t("profile")}
          </button>
          <button
            style={tabStyle(activeTab === TAB_STATS)}
            onClick={() => setActiveTab(TAB_STATS)}
          >
            {t("stats_tab")}
          </button>
          <button
            style={tabStyle(activeTab === TAB_LEADERBOARD)}
            onClick={() => setActiveTab(TAB_LEADERBOARD)}
          >
            {t("leaderboard")}
          </button>
          <button
            style={tabStyle(activeTab === TAB_LAB)}
            onClick={() => setActiveTab(TAB_LAB)}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              {t("keyboard_lab")}
              <span style={{
                fontSize: "8px", fontWeight: 700, letterSpacing: "0.5px",
                textTransform: "uppercase", lineHeight: 1,
                padding: "1px 4px", borderRadius: "3px",
                background: "#4a90d9", color: "#fff",
              }}>beta</span>
            </span>
          </button>
          <button
            style={tabStyle(activeTab === TAB_THEMES)}
            onClick={() => setActiveTab(TAB_THEMES)}
          >
            {t("tab_themes")}
          </button>
          <button
            style={tabStyle(activeTab === TAB_WORDS)}
            onClick={() => setActiveTab(TAB_WORDS)}
          >
            {t("tab_word_lists")}
          </button>
          <button
            style={tabStyle(activeTab === TAB_CREATORS)}
            onClick={() => setActiveTab(TAB_CREATORS)}
          >
            {t("tab_creators")}
          </button>
          <button
            style={tabStyle(activeTab === TAB_SITE)}
            onClick={() => setActiveTab(TAB_SITE)}
          >
            {t("site")}
          </button>
          <button
            style={tabStyle(activeTab === TAB_NEWS)}
            onClick={() => {
              setActiveTab(TAB_NEWS);
              if (onNewsViewed) onNewsViewed();
            }}
          >
            {t("news")}
            {unviewedNewsCount > 0 && activeTab !== TAB_NEWS && (
              <span
                style={{
                  fontSize: "10px",
                  background: "transparent",
                  color: theme.stats,
                  border: `1px solid ${theme.stats}`,
                  borderRadius: "50%",
                  minWidth: "16px",
                  height: "16px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  marginLeft: "4px",
                  verticalAlign: "middle",
                  position: "relative",
                  top: "-1px",
                }}
              >
                {unviewedNewsCount}
              </span>
            )}
          </button>
        </div>
        <MuiIconButton onClick={onClose} style={{ color: theme.textTypeBox }}>
          <CloseIcon fontSize="small" />
        </MuiIconButton>
      </div>
      <DialogContent>
        {/* Profile tab */}
        {activeTab === TAB_PROFILE && (
          <div>
            {/* Section: Name */}
            <div className="profile-section">
              <h4 className="profile-section-label" style={{ color: theme.textTypeBox }}>
                {t("edit_name")}
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, 20))}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      maxLength={20}
                      placeholder={t("your_name_placeholder")}
                      style={{
                        background: "transparent",
                        border: `1px solid ${theme.textTypeBox}`,
                        borderRadius: "4px",
                        color: theme.text,
                        padding: "8px 12px",
                        fontSize: "16px",
                        fontFamily: theme.fontFamily,
                        outline: "none",
                        flex: 1,
                      }}
                    />
                    <MuiIconButton onClick={handleSave} style={{ color: theme.stats }}>
                      <CheckIcon fontSize="small" />
                    </MuiIconButton>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: "18px", color: name ? theme.text : theme.textTypeBox, flex: 1 }}>
                      {name || t("click_to_set_name")}
                      <span style={{ color: theme.textTypeBox, fontSize: "13px", marginLeft: "6px" }}>
                        {getUserTag()}
                      </span>
                    </span>
                    <MuiIconButton onClick={() => setIsEditing(true)} style={{ color: theme.textTypeBox }}>
                      <EditIcon fontSize="small" />
                    </MuiIconButton>
                  </>
                )}
              </div>
              {savedMessage && (
                <p style={{ color: theme.stats, fontSize: "13px", marginTop: "6px" }}>
                  {savedMessage}
                </p>
              )}
              <p style={{ color: theme.textTypeBox, fontSize: "11px", opacity: 0.6, marginTop: "6px", marginBottom: 0 }}>
                {t("profile_note")}
              </p>
            </div>

            {/* Section: Title + Badges (from BadgeDisplay) */}
            <BadgeDisplay theme={theme} />
          </div>
        )}

        {/* Stats tab */}
        {activeTab === TAB_STATS && (
          <StatsPanel key={refreshKey} theme={theme} />
        )}

        {/* Leaderboard tab */}
        {activeTab === TAB_LEADERBOARD && (
          <LeaderboardPanel key={refreshKey} theme={theme} />
        )}

        {/* Site tab */}
        {activeTab === TAB_SITE && (
          <div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>{t("site_focus_mode")}</span>
              <Switch
                checked={isFocusedMode}
                onChange={toggleFocusedMode}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: theme.stats,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: theme.stats,
                  },
                }}
              />
            </div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>{t("site_sound")}</span>
              <Switch
                checked={soundMode}
                onChange={toggleSoundMode}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: theme.stats,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: theme.stats,
                  },
                }}
              />
            </div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>{t("site_music")}</span>
              <Switch
                checked={isMusicMode}
                onChange={toggleMusicMode}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: theme.stats,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: theme.stats,
                  },
                }}
              />
            </div>
            <div style={toggleRowStyle}>
              <span style={toggleLabelStyle}>{t("site_ultra_zen")}</span>
              <Switch
                checked={isUltraZenMode}
                onChange={toggleUltraZenMode}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: theme.stats,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: theme.stats,
                  },
                }}
              />
            </div>
            <div style={{ ...toggleRowStyle, borderBottom: "none" }}>
              <span style={toggleLabelStyle}>{t("site_language")}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    color: locale === "en" ? theme.stats : theme.textTypeBox,
                  }}
                >
                  EN
                </span>
                <Switch
                  checked={locale === "zh"}
                  onChange={() => setLocale(locale === "en" ? "zh" : "en")}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: theme.stats,
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: theme.stats,
                    },
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: locale === "zh" ? theme.stats : theme.textTypeBox,
                  }}
                >
                  中文
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Lab tab */}
        {activeTab === TAB_LAB && (
          <div>
            {/* Under development banner */}
            <div style={{
              border: `2px dashed ${theme.stats}55`,
              borderRadius: "8px",
              padding: "16px 20px",
              marginBottom: "20px",
              textAlign: "center",
            }}>
              <span style={{ fontSize: "14px", color: theme.stats, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
                🚧 {t("keyboard_lab_under_dev")}
              </span>
              <div style={{ marginTop: "8px" }}>
                <a href="/keyboardlab" style={{
                  display: "inline-block",
                  padding: "8px 20px", borderRadius: "6px",
                  background: `linear-gradient(135deg, #6a4c93, #4a90d9)`,
                  color: "#fff", fontWeight: 600, fontSize: "13px",
                  textDecoration: "none",
                }}>
                  → {t("keyboard_lab")}
                </a>
              </div>
            </div>

            {/* Roadmap */}
            <h3 style={{ color: theme.stats, fontSize: "15px", fontWeight: 700, margin: "0 0 12px" }}>
              {tLab("lab_roadmap_title")}
            </h3>
            <p style={{ color: theme.textTypeBox, fontSize: "12px", margin: "0 0 16px" }}>
              {tLab("lab_roadmap_subtitle")}
            </p>

            {[
              { titleKey: "lab_roadmap_done", itemsKey: "lab_roadmap_done_items", icon: "✓", color: "#44dd88" },
              { titleKey: "lab_roadmap_next", itemsKey: "lab_roadmap_next_items", icon: "→", color: theme.stats },
              { titleKey: "lab_roadmap_future", itemsKey: "lab_roadmap_future_items", icon: "◇", color: theme.textTypeBox },
            ].map(({ titleKey, itemsKey, icon, color }) => (
              <div key={titleKey} style={{ marginBottom: "16px" }}>
                <h4 style={{ color, fontSize: "13px", fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {tLab(titleKey)}
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {(tLab(itemsKey) || []).map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "12px", color: theme.text, lineHeight: 1.5 }}>
                      <span style={{ color, flexShrink: 0, fontWeight: 700 }}>{icon}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Editor's note */}
            <div style={{ marginTop: "8px", paddingTop: "16px", borderTop: `1px solid ${theme.textTypeBox}20` }}>
              <h4 style={{ color: theme.stats, fontSize: "13px", fontWeight: 700, margin: "0 0 8px", fontStyle: "italic" }}>
                {tLab("lab_editors_note_title")}
              </h4>
              <div style={{
                color: theme.textTypeBox, fontSize: "12px", lineHeight: 1.8,
                whiteSpace: "pre-wrap", fontStyle: "italic",
              }}>
                {tLab("lab_editors_note").split(tLab("lab_editors_note_link_text")).map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <React.Fragment key={i}>
                      {part}<a href={tLab("lab_editors_note_link")} target="_blank" rel="noopener noreferrer"
                        style={{ color: theme.stats, textDecoration: "underline" }}>{tLab("lab_editors_note_link_text")}</a>
                    </React.Fragment>
                  ) : <React.Fragment key={i}>{part}</React.Fragment>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Themes tab */}
        {activeTab === TAB_THEMES && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h4 className="profile-section-label" style={{ color: theme.textTypeBox, margin: 0 }}>
                {t("theme_group_mine")}
              </h4>
              <button
                onClick={() => {
                  if (onCreateTheme) {
                    onClose && onClose();
                    onCreateTheme();
                  }
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "transparent",
                  border: `1px solid ${theme.stats}`,
                  color: theme.stats,
                  padding: "6px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: theme.fontFamily,
                }}
              >
                <ColorLensIcon style={{ fontSize: 14 }} />
                {t("theme_action_new")}
              </button>
            </div>

            {(!customThemes || customThemes.length === 0) ? (
              <p style={{ color: theme.textTypeBox, fontSize: 13, opacity: 0.7 }}>
                {t("theme_manager_no_themes")}
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {customThemes.map((ct) => {
                  const isActive = theme && theme.id === ct.id;
                  return (
                    <div
                      key={ct.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 10px",
                        border: `1px solid ${isActive ? theme.stats : theme.textTypeBox}40`,
                        borderRadius: 6,
                        background: isActive ? `${theme.stats}10` : "transparent",
                      }}
                    >
                      {/* Swatch row: text, title, accent, untyped */}
                      <div style={{ display: "flex", gap: 3 }}>
                        {[ct.text, ct.title, ct.stats, ct.textTypeBox].map((c, i) => (
                          <span
                            key={i}
                            style={{
                              width: 12, height: 12, borderRadius: 3,
                              background: c,
                              border: `1px solid ${theme.textTypeBox}55`,
                            }}
                          />
                        ))}
                      </div>
                      <span
                        onClick={() => {
                          if (!isActive && onActivateTheme) onActivateTheme(ct);
                        }}
                        style={{
                          flex: 1,
                          color: theme.text,
                          fontSize: 14,
                          cursor: isActive ? "default" : "pointer",
                          fontWeight: isActive ? 600 : 400,
                        }}
                        title={isActive ? "" : t("theme_manager_use_this")}
                      >
                        {ct.label}
                        {isActive && (
                          <span style={{
                            marginLeft: 8, fontSize: 10,
                            color: theme.stats, opacity: 0.85,
                            letterSpacing: 1, textTransform: "uppercase",
                          }}>
                            {t("theme_manager_active")}
                          </span>
                        )}
                      </span>
                      <MuiIconButton
                        size="small"
                        onClick={() => {
                          if (onEditTheme) {
                            onClose && onClose();
                            onEditTheme(ct.id);
                          }
                        }}
                        style={{ color: theme.textTypeBox }}
                        title={t("theme_action_edit")}
                      >
                        <EditIcon fontSize="small" />
                      </MuiIconButton>
                      <MuiIconButton
                        size="small"
                        onClick={() => {
                          if (window.confirm(t("theme_confirm_delete")) && onDeleteTheme) {
                            onDeleteTheme(ct.id);
                          }
                        }}
                        style={{ color: theme.textTypeBox }}
                        title={t("theme_action_delete")}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </MuiIconButton>
                    </div>
                  );
                })}
              </div>
            )}

            <p style={{ color: theme.textTypeBox, fontSize: 11, opacity: 0.6, marginTop: 18, marginBottom: 0 }}>
              {t("theme_manager_note")}
            </p>
          </div>
        )}

        {/* Word Lists tab */}
        {activeTab === TAB_WORDS && (
          <div>
            <input
              ref={importFileInputRef}
              type="file"
              accept="application/json,.json"
              style={{ display: "none" }}
              onChange={handleImportFile}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
              <h4 className="profile-section-label" style={{ color: theme.textTypeBox, margin: 0 }}>
                {t("tab_word_lists")}
              </h4>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button
                  onClick={handleImportClick}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "transparent",
                    border: `1px solid ${theme.textTypeBox}80`,
                    color: theme.text,
                    padding: "6px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: theme.fontFamily,
                  }}
                  title={t("custom_words_action_import_tooltip")}
                >
                  <FileUploadOutlinedIcon style={{ fontSize: 14 }} />
                  {t("custom_words_action_import")}
                </button>
                {customWordLists && customWordLists.length > 0 && (
                  <button
                    onClick={handleExportAllWordLists}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "transparent",
                      border: `1px solid ${theme.textTypeBox}80`,
                      color: theme.text,
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: theme.fontFamily,
                    }}
                    title={t("custom_words_action_export_all_tooltip")}
                  >
                    <FileDownloadOutlinedIcon style={{ fontSize: 14 }} />
                    {t("custom_words_action_export_all")}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onCreateWordList) {
                      onClose && onClose();
                      onCreateWordList();
                    }
                  }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "transparent",
                    border: `1px solid ${theme.stats}`,
                    color: theme.stats,
                    padding: "6px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                    fontFamily: theme.fontFamily,
                  }}
                >
                  <FormatListBulletedIcon style={{ fontSize: 14 }} />
                  {t("custom_words_action_new")}
                </button>
              </div>
            </div>

            {importMessage && (
              <div
                style={{
                  fontSize: 12,
                  color: importMessage.toLowerCase().includes("error") || importMessage.includes("失败") || importMessage.includes("无")
                    ? "#ff6b6b"
                    : theme.stats,
                  marginBottom: 10,
                  opacity: 0.9,
                }}
              >
                {importMessage}
              </div>
            )}

            {(!customWordLists || customWordLists.length === 0) ? (
              <p style={{ color: theme.textTypeBox, fontSize: 13, opacity: 0.7 }}>
                {t("custom_words_manager_no_lists")}
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {customWordLists.map((wl) => {
                  const isActive = wl.id === activeWordListId;
                  const parsedCount = parseCustomWordsText(wl).length;
                  const langLabel =
                    wl.language === CHINESE_MODE
                      ? t("custom_words_manager_lang_zh")
                      : t("custom_words_manager_lang_en");
                  return (
                    <div
                      key={wl.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 10px",
                        border: `1px solid ${isActive ? theme.stats : theme.textTypeBox}40`,
                        borderRadius: 6,
                        background: isActive ? `${theme.stats}10` : "transparent",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          padding: "2px 6px",
                          borderRadius: 3,
                          border: `1px solid ${theme.textTypeBox}55`,
                          color: theme.textTypeBox,
                        }}
                      >
                        {langLabel}
                      </span>
                      <span
                        onClick={() => {
                          if (!isActive && onActivateWordList) onActivateWordList(wl.id);
                          else if (isActive && onDeactivateWordList) onDeactivateWordList();
                        }}
                        style={{
                          flex: 1,
                          color: theme.text,
                          fontSize: 14,
                          cursor: "pointer",
                          fontWeight: isActive ? 600 : 400,
                        }}
                        title={isActive ? t("custom_words_action_deactivate") : t("custom_words_manager_use_this")}
                      >
                        {wl.name}
                        <span style={{ color: theme.textTypeBox, fontSize: 11, marginLeft: 8 }}>
                          {t("custom_words_manager_word_count", parsedCount)}
                        </span>
                        {isActive && (
                          <span style={{
                            marginLeft: 8, fontSize: 10,
                            color: theme.stats, opacity: 0.85,
                            letterSpacing: 1, textTransform: "uppercase",
                          }}>
                            {t("custom_words_manager_active")}
                          </span>
                        )}
                      </span>
                      <MuiIconButton
                        size="small"
                        onClick={() => {
                          if (onEditWordList) {
                            onClose && onClose();
                            onEditWordList(wl.id);
                          }
                        }}
                        style={{ color: theme.textTypeBox }}
                        title={t("custom_words_action_edit")}
                      >
                        <EditIcon fontSize="small" />
                      </MuiIconButton>
                      <MuiIconButton
                        size="small"
                        onClick={() => handleExportSingleWordList(wl)}
                        style={{ color: theme.textTypeBox }}
                        title={t("custom_words_action_export")}
                      >
                        <FileDownloadOutlinedIcon fontSize="small" />
                      </MuiIconButton>
                      <MuiIconButton
                        size="small"
                        onClick={() => {
                          if (window.confirm(t("custom_words_confirm_delete")) && onDeleteWordList) {
                            onDeleteWordList(wl.id);
                          }
                        }}
                        style={{ color: theme.textTypeBox }}
                        title={t("custom_words_action_delete")}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </MuiIconButton>
                    </div>
                  );
                })}
              </div>
            )}

            <p style={{ color: theme.textTypeBox, fontSize: 11, opacity: 0.6, marginTop: 18, marginBottom: 0 }}>
              {t("custom_words_manager_note")}
            </p>
          </div>
        )}

        {/* Creators / friend-link submission tab. Mirrors the layout of the
            customize-wiki-news /creator page (3 numbered why-rows + FAQ +
            CTA) but lives inside the eletypes Profile modal so creators can
            discover it without leaving the main app. The CTA opens a
            Tencent Survey for the actual submission. */}
        {activeTab === TAB_CREATORS && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                margin: "0 0 4px",
              }}
            >
              <h2
                style={{
                  color: theme.title,
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {t("creators_title")}
              </h2>
              {/* Interest-check chip — signals to creators that this is a
                  pre-launch interest pool, not a fully running aggregator.
                  Borrows the amber "preview" treatment from the customize-
                  wiki-news site so the early-stage signal is consistent. */}
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  border: "1px solid rgba(255, 195, 99, 0.45)",
                  background: "rgba(255, 195, 99, 0.08)",
                  color: "#ffc363",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {t("creators_ic_badge")}
              </span>
            </div>
            <p style={{ color: theme.textTypeBox, fontSize: 13, opacity: 0.75, margin: "0 0 24px" }}>
              {t("creators_subtitle")}
            </p>

            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${theme.stats}1f`,
                    border: `1px solid ${theme.stats}55`,
                    borderRadius: "50%",
                    color: theme.stats,
                    fontFamily: "monospace",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  {String(n).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: "4px 0 4px",
                      fontSize: 14,
                      fontWeight: 500,
                      color: theme.text,
                    }}
                  >
                    {t(`creators_why_${n}_title`)}
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: theme.textTypeBox, opacity: 0.85 }}>
                    {t(`creators_why_${n}_body`)}
                  </p>
                </div>
              </div>
            ))}

            <div
              style={{
                textAlign: "center",
                padding: "20px 0 8px",
                borderTop: `1px solid ${theme.textTypeBox}20`,
                borderBottom: `1px solid ${theme.textTypeBox}20`,
                margin: "20px 0 14px",
              }}
            >
              <a
                href={CREATOR_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "10px 28px",
                  background: `${theme.stats}1c`,
                  border: `1px solid ${theme.stats}`,
                  borderRadius: 6,
                  color: theme.stats,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  fontFamily: theme.fontFamily,
                }}
              >
                {t("creators_cta")}
              </a>
              <p style={{ margin: "10px 0 0", fontSize: 11, opacity: 0.55, color: theme.textTypeBox }}>
                {t("creators_cta_sub")}
              </p>
            </div>

            <h4
              style={{
                margin: "20px 0 12px",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: theme.textTypeBox,
                opacity: 0.65,
              }}
            >
              {t("creators_faq_heading")}
            </h4>
            {[1, 2, 3, 4, 5].map((n) => (
              <details
                key={n}
                style={{
                  padding: "10px 0",
                  borderBottom: `1px solid ${theme.textTypeBox}15`,
                }}
              >
                <summary
                  style={{
                    fontSize: 13,
                    cursor: "pointer",
                    color: theme.text,
                    listStyle: "none",
                  }}
                >
                  {t(`creators_faq_${n}_q`)}
                </summary>
                <p
                  style={{
                    margin: "8px 0 4px 0",
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: theme.textTypeBox,
                    opacity: 0.85,
                  }}
                >
                  {t(`creators_faq_${n}_a`)}
                </p>
              </details>
            ))}
          </div>
        )}

        {/* News tab */}
        {activeTab === TAB_NEWS && (
          <div>
            {ALL_NEWS_KEYS.length === 0 ? (
              <p style={{ color: theme.textTypeBox, fontSize: "14px" }}>
                {t("no_news")}
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {ALL_NEWS_KEYS.map((banner) => {
                  const text = t(banner.fullTextKey);
                  return (
                    <div
                      key={banner.id}
                      style={{
                        padding: "12px 16px",
                        border: `1px solid ${theme.textTypeBox}30`,
                        borderRadius: "6px",
                        fontSize: "14px",
                        color: theme.textTypeBox,
                      }}
                    >
                      <span style={{ color: theme.stats, fontFamily: "monospace", marginRight: "8px" }}>
                        &gt;
                      </span>
                      {renderNewsHighlighted(text, banner.highlights, theme)}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
