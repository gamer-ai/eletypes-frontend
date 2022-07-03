import React from "react";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import Select from "../utils/Select";
import { FOCUS_MODE, FREE_MODE, MUSIC_MODE, WORD_MODE_LABEL, SENTENCE_MODE_LABEL, GAME_MODE_DEFAULT, GAME_MODE_SENTENCE} from "../../constants/Constants";
import { Link } from "@mui/material";
import SupportMe from "../features/SupportMe";
import { GITHUB_TOOLTIP_TITLE } from "../../constants/Constants";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";

const FooterMenu = ({
  themesOptions,
  theme,
  handleThemeChange,
  toggleFocusedMode,
  toggleMusicMode,
  toggleCoffeeMode,
  isMusicMode,
  isFocusedMode,
  isCoffeeMode,
  gameMode,
  handleGameModeChange,
}) => {
  const isSiteInfoDisabled = isMusicMode || isFocusedMode;
  const isBottomLogoEnabled = isFocusedMode && !isMusicMode;

  const getModeButtonClassName = (mode) => {
    if (mode) {
      return "zen-button";
    }
    return "zen-button-deactive";
  };

  const getGameModeButtonClassName = (currMode, buttonMode) => {
    if (currMode === buttonMode){
      return "active-game-mode-button";
    }
    return "inactive-game-mode-button";
  }

  return (
    <div className="footer">
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

          <IconButton onClick={toggleMusicMode}>
            <Tooltip title={MUSIC_MODE}>
              <span className={getModeButtonClassName(isMusicMode)}>
                <MusicNoteIcon fontSize="medium"></MusicNoteIcon>
              </span>
            </Tooltip>{" "}
          </IconButton>
          { !isCoffeeMode && (<>
            <IconButton
              onClick={() => {
                handleGameModeChange(GAME_MODE_DEFAULT)
              }}
            >
              <span className={getGameModeButtonClassName(gameMode, GAME_MODE_DEFAULT)}>
                {WORD_MODE_LABEL}
              </span>
            </IconButton>
            <IconButton
              onClick={() => {
                handleGameModeChange(GAME_MODE_SENTENCE)
              }}
            >
              <span className={getGameModeButtonClassName(gameMode, GAME_MODE_SENTENCE)}>
                {SENTENCE_MODE_LABEL}
              </span>
            </IconButton>

          </>)}
        </Box>
        {!isSiteInfoDisabled && (
          <Box display="block" flexDirection="row">
            <SupportMe></SupportMe>
            <Tooltip
              title={
                <span style={{ whiteSpace: "pre-line" }}>
                  {GITHUB_TOOLTIP_TITLE}
                </span>
              }
              placement="top"
            >
              <IconButton
                href="https://github.com/gamer-ai/eletype-frontend/"
                color="inherit"
              >
                <GitHubIcon></GitHubIcon>
              </IconButton>
            </Tooltip>
            <span>{"    "}</span>
            <Link
              color="inherit"
              margin="inherit"
              underline="none"
              href="https://muyangguo.xyz"
            >
              @Muyang Guo
            </Link>
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
    </div>
  );
};

export default FooterMenu;
