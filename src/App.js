import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme, themesOptions } from "./style/theme";
import { GlobalStyles } from "./style/global";
import TypeBox from "./components/features/TypeBox";
import Select from "./components/utils/Select";
import IconButton from "@mui/material/IconButton";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import Link from "@mui/material/Link";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import { Tooltip } from "@mui/material";
import { FOCUS_MODE } from "./constants/Constants";
import MusicPlayer from "./components/features/MusicPlayer";
import MusicIconButton from "./components/utils/MusicIconButton";
import { Snackbar } from "@mui/material";

function App() {
  const [theme, setTheme] = useState(defaultTheme);
  const [isFocusedMode, setIsFocusedMode] = useState(false);
  const [isMusicMode, setIsMusicMode] = useState(false);
  const textInputRef = useRef(null);

  const focusTextInput = () => {
    textInputRef.current && textInputRef.current.focus();
  };

  useEffect(() => {
    focusTextInput();
  }, [theme, isFocusedMode, isMusicMode]);

  const handleThemeChange = (e) => {
    setTheme(e.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        {!isFocusedMode && (
          <header>
            <h1>
              Ele Types <KeyboardAltIcon fontSize="large" />
            </h1>
            <span className="sub-header">
              an elegant typing experience, just start typing
            </span>
          </header>
        )}
        <TypeBox
          textInputRef={textInputRef}
          isFocusedMode={isFocusedMode}
          key="type-box"
        ></TypeBox>
        <footer>
          <Grid container justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="row">
              <Select
                classNamePrefix="Select"
                value={themesOptions.find((e) => e.value === theme)}
                options={themesOptions}
                isSearchable={false}
                isSelected={false}
                onChange={handleThemeChange}
                menuPlacement="top"
              ></Select>

              <IconButton
                onClick={() => {
                  setIsFocusedMode(!isFocusedMode);
                }}
              >
                <Tooltip title={FOCUS_MODE}>
                  <span className="zen-button">
                    <SelfImprovementIcon fontSize="medium"></SelfImprovementIcon>
                  </span>
                </Tooltip>
              </IconButton>
              <IconButton
                onClick={() => {
                  setIsMusicMode(!isMusicMode);
                }}
              >
                <MusicIconButton disabled={!isMusicMode}></MusicIconButton>
              </IconButton>
            </Box>
          </Grid>
        </footer>
        <Snackbar
          open={isMusicMode}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
        <IconButton hidden={true} onMouseLeave={() => focusTextInput()}>
                <MusicPlayer disabled={!isMusicMode} isZenMode={isFocusedMode}></MusicPlayer>
            </IconButton>
        </Snackbar>
        {!isFocusedMode && (
          <Box display="block" flexDirection="row" className="bottom-info">
            <IconButton
              href="https://github.com/gamer-ai/eletype-frontend/"
              color="inherit"
            >
              <GitHubIcon></GitHubIcon>
            </IconButton>
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
        {isFocusedMode && (
          <span className="bottom-info">
            Ele Types <KeyboardAltIcon fontSize="small" />
          </span>
        )}
      </>
    </ThemeProvider>
  );
}

export default App;
