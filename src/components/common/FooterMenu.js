import React from "react";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MusicIconButton from "../utils/MusicIconButton";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import Select from "../utils/Select";
import { FOCUS_MODE } from "../../constants/Constants";
import { Link } from "@mui/material";
import SupportMe from "../features/SupportMe";
import { GITHUB_TOOLTIP_TITLE } from "../../constants/Constants";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";


const FooterMenu = ({
  themesOptions,
  theme,
  handleThemeChange,
  toggleFocusedMode,
  toggleMusicMode,
  isMusicMode,
  isFocusedMode,
}) => {
  const isSiteInfoDisabled = isMusicMode || isFocusedMode;
  const isBottomLogoEnabled = isFocusedMode && !isMusicMode;

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
              <span className="zen-button">
                <SelfImprovementIcon fontSize="medium"></SelfImprovementIcon>
              </span>
            </Tooltip>
          </IconButton>
          <IconButton onClick={toggleMusicMode}>
            <MusicIconButton disabled={!isMusicMode}></MusicIconButton>
          </IconButton>
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
            <Link
              color="inherit"
              margin="inherit"
              underline="none"
              href="https://github.com/gamer-ai/eletype-frontend/blob/main/LICENSE"
            >
              &copy;GPLv3
            </Link>
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
              Ele Types <KeyboardAltIcon fontSize="small" /></span>
            </IconButton>
          </Box>
        )}
      </Grid>
    </div>
  );
};

export default FooterMenu;
