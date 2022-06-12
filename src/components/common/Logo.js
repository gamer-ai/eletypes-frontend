import React from "react";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import { Box } from "@mui/system";
import IconButton from "../utils/IconButton";

const Logo = ({ isFocusedMode, isMusicMode }) => {
  if (isFocusedMode) {
    if (isMusicMode) return null;
    return (
      <Box display="block" flexDirection="row" className="bottom-info">
        <IconButton
          href="https://github.com/gamer-ai/eletype-frontend/"
          color="inherit"
        >
          Ele Types <KeyboardAltIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  }
  return (
    <header>
      <h1>
        Ele Types <KeyboardAltIcon fontSize="large" />
      </h1>
      <span className="sub-header">
        an elegant typing experience, just start typing
      </span>
    </header>
  );
};

export default Logo;
