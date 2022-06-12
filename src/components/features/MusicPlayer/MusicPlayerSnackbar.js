import React from "react";
import IconButton from "../../utils/IconButton";
import MusicPlayer from "./MusicPlayer";
import { Snackbar } from "@mui/material";

const MusicPlayerSnackbar = ({isMusicMode, isFocusedMode, onMouseLeave }) => {

  return (
    <Snackbar
    open={isMusicMode}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
  >
    <IconButton hidden={true} onMouseLeave={onMouseLeave}>
      <MusicPlayer
        disabled={!isMusicMode}
        isZenMode={isFocusedMode}
      ></MusicPlayer>
    </IconButton>
  </Snackbar>
  );
};

export default MusicPlayerSnackbar;