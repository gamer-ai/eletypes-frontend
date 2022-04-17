import React, { useState, useRef, useEffect} from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme, themesOptions } from "./style/theme";
import { GlobalStyles } from "./style/global";
import TypeBox from "./components/features/TypeBox";
import Select from "./components/utils/Select";

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
        <h1>Ele Type</h1>
          <a href={() => false}>an elegant typing experience</a>
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
      </>
    </ThemeProvider>
  );
}

export default App;
