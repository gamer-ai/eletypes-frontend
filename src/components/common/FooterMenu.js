import React from "react";
import { Grid, AppBar } from "@mui/material";
import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Select from "../utils/Select";
import {
  FOCUS_MODE,
  FREE_MODE,
  MUSIC_MODE,
  WORD_MODE_LABEL,
  SENTENCE_MODE_LABEL,
  GAME_MODE_DEFAULT,
  GAME_MODE_SENTENCE,
  TRAINER_MODE,
  WORDS_CARD_MODE,
} from "../../constants/Constants";
import { Link } from "@mui/material";
import SupportMe from "../features/SupportMe";
import {
  GITHUB_TOOLTIP_TITLE,
  AUTHOR,
  GITHUB_REPO_LINK,
} from "../../constants/Constants";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import { ReactComponent as DiscordIcon } from "../../assets/Icons/discord.svg";
import { SvgIcon } from "@mui/material";
import KeyboardAltOutlinedIcon from "@mui/icons-material/KeyboardAltOutlined";
import SchoolIcon from "@mui/icons-material/School";
import { SOUND_MODE_TOOLTIP } from "../features/sound/sound";

const FooterMenu = ({
  themesOptions,
  theme,
  soundMode,
  toggleSoundMode,
  soundOptions,
  soundType,
  handleSoundTypeChange,
  handleThemeChange,
  toggleFocusedMode,
  toggleMusicMode,
  toggleCoffeeMode,
  isMusicMode,
  isFocusedMode,
  isCoffeeMode,
  gameMode,
  handleGameModeChange,
  isTrainerMode,
  toggleTrainerMode,
  isWordsCardMode,
  toggleWordsCardMode,
}) => {
  const isSiteInfoDisabled = isMusicMode || isFocusedMode;
  const isBottomLogoEnabled = isFocusedMode && !isMusicMode;
  const isTypeTestEnabled = !isCoffeeMode && !isTrainerMode && !isWordsCardMode;

  const getModeButtonClassName = (mode) => {
    if (mode) {
      return "zen-button";
    }
    return "zen-button-deactive";
  };

  const getGameModeButtonClassName = (currMode, buttonMode) => {
    if (currMode === buttonMode) {
      return "active-game-mode-button";
    }
    return "inactive-game-mode-button";
  };

  return (
    <AppBar position="static"
    color="transparent" className="bottomBar">
      <Grid container justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="row">
          <Select
            classNamePrefix="Select"
            value={themesOptions.find((e) => e.value.label === theme.label)}
            options={themesOptions}
            isSearchable={false}
            isSelected={false}
            onChange={handleThemeChange}
            menuPlacement="top"
          ></Select>

          <IconButton onClick={toggleFocusedMode}>
            <Tooltip title={FOCUS_MODE}>
              <span className={getModeButtonClassName(isFocusedMode)}>
                <SelfImprovementIcon fontSize="medium"></SelfImprovementIcon>
              </span>
            </Tooltip>
          </IconButton>
          <IconButton onClick={toggleSoundMode}>
            <Tooltip title={SOUND_MODE_TOOLTIP}>
              <span className={getModeButtonClassName(soundMode)}>
                <VolumeUpIcon fontSize="medium"></VolumeUpIcon>
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
            ></Select>
          )}
          <IconButton onClick={toggleWordsCardMode}>
            <Tooltip
              title={
                <span style={{ whiteSpace: "pre-line" }}>
                  {WORDS_CARD_MODE}
                </span>
              }
            >
              <span className={getModeButtonClassName(isWordsCardMode)}>
                <SchoolIcon fontSize="medium"></SchoolIcon>
              </span>
            </Tooltip>
          </IconButton>
          <IconButton onClick={toggleCoffeeMode}>
            <Tooltip
              title={
                <span style={{ whiteSpace: "pre-line" }}>{FREE_MODE}</span>
              }
            >
              <span className={getModeButtonClassName(isCoffeeMode)}>
                <EmojiFoodBeverageIcon fontSize="medium"></EmojiFoodBeverageIcon>
              </span>
            </Tooltip>
          </IconButton>
          <IconButton onClick={toggleTrainerMode}>
            <Tooltip title={TRAINER_MODE}>
              <span className={getModeButtonClassName(isTrainerMode)}>
                <KeyboardAltOutlinedIcon fontSize="medium"></KeyboardAltOutlinedIcon>
              </span>
            </Tooltip>
          </IconButton>
          <IconButton onClick={toggleMusicMode}>
            <Tooltip title={MUSIC_MODE}>
              <span className={getModeButtonClassName(isMusicMode)}>
                <MusicNoteIcon fontSize="medium"></MusicNoteIcon>
              </span>
            </Tooltip>{" "}
          </IconButton>
          {isTypeTestEnabled && (
            <>
              <IconButton
                onClick={() => {
                  handleGameModeChange(GAME_MODE_DEFAULT);
                }}
              >
                <span
                  className={getGameModeButtonClassName(
                    gameMode,
                    GAME_MODE_DEFAULT
                  )}
                >
                  {WORD_MODE_LABEL}
                </span>
              </IconButton>
              <IconButton
                onClick={() => {
                  handleGameModeChange(GAME_MODE_SENTENCE);
                }}
              >
                <span
                  className={getGameModeButtonClassName(
                    gameMode,
                    GAME_MODE_SENTENCE
                  )}
                >
                  {SENTENCE_MODE_LABEL}
                </span>
              </IconButton>
            </>
          )}
        </Box>
        {!isSiteInfoDisabled && (
          <Box display="block" flexDirection="row">
            <SupportMe></SupportMe>
            <Tooltip
              title={
                <span style={{ whiteSpace: "pre-line", fontSize: "12px" }}>
                  {GITHUB_TOOLTIP_TITLE}
                  <Link margin="inherit" href="https://muyangguo.xyz">
                    {AUTHOR}
                  </Link>
                  <Link
                    margin="inherit"
                    href="https://github.com/gamer-ai/eletype-frontend/"
                  >
                    {GITHUB_REPO_LINK}
                  </Link>
                </span>
              }
              placement="top-start"
            >
              <IconButton
                href="https://github.com/gamer-ai/eletype-frontend/"
                color="inherit"
              >
                <GitHubIcon></GitHubIcon>
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <span style={{ whiteSpace: "pre-line" }}>
                  <iframe
                    title="discord-widget"
                    src="https://discord.com/widget?id=993567075589181621&theme=dark"
                    width="100%"
                    height="300"
                    allowtransparency="true"
                    frameborder="0"
                    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  ></iframe>
                </span>
              }
              placement="top-start"
            >
              <IconButton color="inherit">
                <SvgIcon>
                  <DiscordIcon></DiscordIcon>
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </Box>
        )}
        {isBottomLogoEnabled && (
          <Box display="block" flexDirection="row" className="bottom-info">
            <IconButton
              href="https://github.com/gamer-ai/eletype-frontend/"
              color="inherit"
            >
              <span>
                Ele Types <KeyboardAltIcon fontSize="small" />
              </span>
            </IconButton>
          </Box>
        )}
      </Grid>
    </AppBar>
  );
};

export default FooterMenu;
