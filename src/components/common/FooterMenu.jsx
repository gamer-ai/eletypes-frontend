import React from "react";
import TranslateIcon from "@mui/icons-material/Translate";
import { AppBar } from "@mui/material";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Select from "../utils/Select";
import {
  WORD_MODE_LABEL,
  SENTENCE_MODE_LABEL,
  GAME_MODE_DEFAULT,
  GAME_MODE_SENTENCE,
} from "../../constants/Constants";
import { Link } from "@mui/material";
import SupportMe from "../features/SupportMe";
import GitHubIcon from "@mui/icons-material/GitHub";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DiscordIcon from "../../assets/Icons/DiscordIcon";
import { SvgIcon } from "@mui/material";
import KeyboardAltOutlinedIcon from "@mui/icons-material/KeyboardAltOutlined";
import SchoolIcon from "@mui/icons-material/School";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import EditIcon from "@mui/icons-material/Edit";
import { useLocale } from "../../context/LocaleContext";
import { buildGroupedOptions, findOptionForTheme, isCustomTheme } from "../../style/customThemes";

const FooterMenu = ({
  customThemes,
  theme,
  soundMode,
  toggleSoundMode,
  soundOptions,
  soundType,
  handleSoundTypeChange,
  handleThemeChange,
  onCreateTheme,
  onEditCurrentTheme,
  toggleFocusedMode,
  toggleMusicMode,
  toggleUltraZenMode,
  isUltraZenMode,
  isMusicMode,
  isFocusedMode,
  gameMode,
  handleGameModeChange,
  isTrainerMode,
  toggleTrainerMode,
  isWordsCardMode,
  isWordGameMode,
  toggleWordsCardMode,
}) => {
  const { locale, setLocale, t } = useLocale();
  const isSiteInfoDisabled = isMusicMode || isFocusedMode;
  const isSpecialMode = isTrainerMode || isWordsCardMode;
  const groupedThemeOptions = buildGroupedOptions(customThemes, t);
  const themeOptionValue = findOptionForTheme(groupedThemeOptions, theme);
  const currentIsCustom = isCustomTheme(theme);

  const activeCls = (on) => (on ? "nav-item-active" : "nav-item");
  const modeCls = (currMode, buttonMode) => {
    if (isSpecialMode) return "nav-mode";
    return currMode === buttonMode ? "nav-mode-active" : "nav-mode";
  };

  const handleWordSentenceMode = (mode) => {
    if (isTrainerMode) toggleTrainerMode();
    if (isWordsCardMode) toggleWordsCardMode();
    handleGameModeChange(mode);
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      className={`bottomBar ${isFocusedMode && "fade-element"}`}
      elevation={0}
    >
      <div className="nav-container">
        {/* Group 1: Game Modes */}
        <div className="nav-group">
          <span className="nav-group-label">{t("nav_mode")}</span>
          <div className="nav-group-items">
            <IconButton
              size="small"
              onClick={() => handleWordSentenceMode(GAME_MODE_DEFAULT)}
            >
              <span className={modeCls(gameMode, GAME_MODE_DEFAULT)}>
                {WORD_MODE_LABEL}
              </span>
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleWordSentenceMode(GAME_MODE_SENTENCE)}
            >
              <span className={modeCls(gameMode, GAME_MODE_SENTENCE)}>
                {SENTENCE_MODE_LABEL}
              </span>
            </IconButton>
            <IconButton size="small" onClick={() => window.location.href = "/markdown"}>
              <Tooltip title={t("markdown_mode")}>
                <span className="nav-item">
                  <svg width="20" height="20" viewBox="0 0 208 128" fill="none" style={{ verticalAlign: "middle" }}>
                    <rect x="5" y="5" width="198" height="118" rx="12" stroke="currentColor" strokeWidth="10" fill="none"/>
                    <path d="M30 98V30h20l20 25 20-25h20v68h-20V59L70 84 50 59v39H30zm125 0l-30-35h20V30h20v33h20l-30 35z" fill="currentColor"/>
                  </svg>
                </span>
              </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={toggleTrainerMode}>
              <Tooltip title={t("trainer_mode")}>
                <span className={activeCls(isTrainerMode)}>
                  <KeyboardAltOutlinedIcon fontSize="small" />
                </span>
              </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={toggleWordsCardMode}>
              <Tooltip title={t("words_card_mode")}>
                <span className={activeCls(isWordsCardMode)}>
                  <SchoolIcon fontSize="small" />
                </span>
              </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={() => window.location.href = "/keyboardlab"}>
              <Tooltip title="Keyboard Lab">
                <span className="nav-item" style={{ position: "relative", display: "inline-flex" }}>
                  <DesignServicesIcon fontSize="small" />
                  <span style={{
                    position: "absolute", top: "-6px", right: "-12px",
                    fontSize: "7px", fontWeight: 700, letterSpacing: "0.5px",
                    textTransform: "uppercase", lineHeight: 1,
                    padding: "1px 3px", borderRadius: "3px",
                    background: "#4a90d9", color: "#fff",
                  }}>beta</span>
                </span>
              </Tooltip>
            </IconButton>
          </div>
        </div>

        {/* Group 2 (ultra zen / custom words / leaderboard) was moved to a
            strip above the TypeBox words area — see TypeBoxQuickTools — so
            new features get a more discoverable home. */}

        {/* Group 3: Settings */}
        <div className="nav-group">
          <span className="nav-group-label">{t("nav_settings")}</span>
          <div className="nav-group-items">
            <Select
              classNamePrefix="Select"
              value={themeOptionValue}
              options={groupedThemeOptions}
              isSearchable={false}
              isSelected={false}
              onChange={handleThemeChange}
              menuPlacement="top"
              formatOptionLabel={(option, { context }) => (
                <span>
                  {option.label}
                  {option.isNew && context === "menu" && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 9,
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        color: "#ff3b00",
                        border: "1px solid #ff3b00",
                        borderRadius: 3,
                        padding: "1px 4px",
                        verticalAlign: "1px",
                      }}
                    >
                      NEW
                    </span>
                  )}
                </span>
              )}
            />
            {currentIsCustom && onEditCurrentTheme && (
              <IconButton size="small" onClick={onEditCurrentTheme}>
                <Tooltip title={t("theme_action_edit")}>
                  <span className="nav-item">
                    <EditIcon fontSize="small" />
                  </span>
                </Tooltip>
              </IconButton>
            )}
            {onCreateTheme && (
              <IconButton size="small" onClick={onCreateTheme}>
                <Tooltip title={t("theme_action_new")}>
                  <span className="nav-item">
                    <ColorLensIcon fontSize="small" />
                  </span>
                </Tooltip>
              </IconButton>
            )}
            <IconButton size="small" onClick={toggleFocusedMode}>
              <Tooltip title={t("focus_mode")}>
                <span className={activeCls(isFocusedMode)}>
                  <SelfImprovementIcon fontSize="small" />
                </span>
              </Tooltip>
            </IconButton>
            <IconButton size="small" onClick={toggleSoundMode}>
              <Tooltip title={t("sound_mode_tooltip")}>
                <span className={activeCls(soundMode)}>
                  {soundMode ? (
                    <VolumeUpIcon fontSize="small" />
                  ) : (
                    <VolumeOffIcon fontSize="small" />
                  )}
                </span>
              </Tooltip>
            </IconButton>
            {soundMode && (
              <Select
                classNamePrefix="Select"
                value={soundOptions.find((e) => e.label === soundType)}
                options={soundOptions}
                isSearchable={false}
                isSelected={false}
                onChange={handleSoundTypeChange}
                menuPlacement="top"
              />
            )}
            <IconButton size="small" onClick={toggleMusicMode}>
              <Tooltip title={t("music_mode")}>
                <span className={activeCls(isMusicMode)}>
                  <MusicNoteIcon fontSize="small" />
                </span>
              </Tooltip>
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setLocale(locale === "en" ? "zh" : "en")}
            >
              <Tooltip title={t("locale_toggle")}>
                <span className="nav-item">
                  <TranslateIcon fontSize="small" />
                </span>
              </Tooltip>
            </IconButton>
          </div>
        </div>

        {/* Group 4: Links */}
        {!isSiteInfoDisabled && (
          <div className="nav-group nav-group-links">
            {/* Hidden spacer keeps the column the same height as the other
                groups (label + items) so items align across the row. */}
            <span
              className="nav-group-label"
              aria-hidden="true"
              style={{ visibility: "hidden" }}
            >
              ·
            </span>
            <div className="nav-group-items">
              <SupportMe />
              <Tooltip
                title={
                  <span
                    style={{ whiteSpace: "pre-line", fontSize: "12px" }}
                  >
                    {t("github_tooltip")}
                    <Link margin="inherit" href="https://muyangguo.com">
                      {t("author")}
                    </Link>
                    <Link
                      margin="inherit"
                      href="https://github.com/gamer-ai/eletype-frontend/"
                    >
                      {t("github_repo")}
                    </Link>
                  </span>
                }
                placement="top-start"
              >
                <IconButton
                  size="small"
                  href="https://github.com/gamer-ai/eletype-frontend/"
                  color="inherit"
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  <iframe
                    title="discord-widget"
                    src="https://discord.com/widget?id=993567075589181621&theme=dark"
                    width="300"
                    height="300"
                    allowtransparency="true"
                    frameBorder="0"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    style={{ display: "block", border: "none" }}
                  />
                }
                placement="top-start"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "transparent",
                      padding: 0,
                      maxWidth: "none",
                      boxShadow: "none",
                    },
                  },
                }}
              >
                <IconButton size="small" color="inherit">
                  <SvgIcon fontSize="small">
                    <DiscordIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        )}
      </div>

    </AppBar>
  );
};

export default FooterMenu;
