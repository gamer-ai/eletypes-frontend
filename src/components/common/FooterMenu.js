import React from "react";
import { Grid } from "@mui/material";import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MusicIconButton from "../utils/MusicIconButton";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import Select from "../utils/Select";
import { FOCUS_MODE } from "../../constants/Constants";

const FooterMenu = ({ themesOptions, theme, handleThemeChange, toggleFocusedMode, toggleMusicMode, isMusicMode }) => {
  return (
    <footer>
    <Grid container justifyContent="center" alignItems="center">
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
        <IconButton
          onClick={toggleMusicMode}
        >
          <MusicIconButton disabled={!isMusicMode}></MusicIconButton>
        </IconButton>
      </Box>
    </Grid>
  </footer>
  );
};

export default FooterMenu;