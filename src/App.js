import React, { useState, useRef, useEffect} from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme, themesOptions } from "./style/theme";
import { GlobalStyles } from "./style/global";
import TypeBox from "./components/features/TypeBox";
import Select from "./components/utils/Select";
import IconButton from '@mui/material/IconButton';
import CopyrightIcon from '@mui/icons-material/Copyright';

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
        <h1>Ele Types</h1>
          <span >an elegant typing experience, just start typing</span>
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
          <IconButton href="https://github.com/gamer-ai/eletype-frontend/blob/main/LICENSE" color="primary" aria-label="add to shopping cart">          
          <CopyrightIcon></CopyrightIcon>
          </IconButton>
          </>
          </div>
      </>
    </ThemeProvider>
  );
}

export default App;
