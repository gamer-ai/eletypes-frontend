import React, { useState, useRef, useEffect} from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme, themesOptions } from "./style/theme";
import { GlobalStyles } from "./style/global";
import TypeBox from "./components/features/TypeBox";
import Select from "./components/utils/Select";
import IconButton from '@mui/material/IconButton';
import KeyboardAltIcon from '@mui/icons-material/KeyboardAlt';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from '@mui/material/Link';


function App() {
  const [theme, setTheme] = useState(defaultTheme);
  const textInputRef = useRef(null);

  const focusTextInput = () => {
    textInputRef.current && textInputRef.current.focus()
  }
  useEffect(() => {focusTextInput()}, [theme]);
  const handleThemeChange = (e) => {
    setTheme(e.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        <header>
          <h1>Ele Types <KeyboardAltIcon fontSize="large"/></h1>
          <span className="sub-header" >an elegant typing experience, just start typing</span>
        </header>
        <TypeBox textInputRef={textInputRef} key="type-box"></TypeBox>
        <footer>
          <Select
            classNamePrefix="Select"
            value={themesOptions.find((e) => e.value === theme)}
            options={themesOptions}
            isSearchable={false}
            isSelected={false}
            onChange={handleThemeChange}
            menuPlacement="top"
          />
        </footer>
        <div className="bottom-info">
          <>
          <IconButton href="https://github.com/gamer-ai/eletype-frontend/" color="primary">          
          <GitHubIcon></GitHubIcon>
          </IconButton>
          <Link href="https://github.com/gamer-ai/eletype-frontend/blob/main/LICENSE">&copy;GPLv3</Link>
          <span>  </span>
          <Link href="https://muyangguo.xyz">@Muyang Guo</Link>
          </>
          </div>
      </>
    </ThemeProvider>
  );
}

export default App;
