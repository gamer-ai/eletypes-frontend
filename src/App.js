import React, { useState, useRef, useEffect, createContext } from "react";
import { useCookies } from "react-cookie";
import { ThemeProvider } from "styled-components";
import { defaultTheme, themesOptions } from "./style/theme";
import { GlobalStyles } from "./style/global";
import TypeBox from "./components/features/TypeBox/TypeBox";
import SentenceBox from "./components/features/SentenceBox/SentenceBox";
import RankingBox from "./components/features/RankingBox/RankingBox";
import Logo from "./components/common/Logo";
import MusicPlayerSnackbar from "./components/features/MusicPlayer/MusicPlayerSnackbar";
import FooterMenu from "./components/common/FooterMenu";
import FreeTypingBox from "./components/features/FreeTypingBox";
import {
  GAME_MODE,
  GAME_MODE_DEFAULT,
  GAME_MODE_SENTENCE,
  GAME_MODE_RANKING,
} from "./constants/Constants";
import useLocalPersistState from "./hooks/useLocalPersistState";
import DefaultKeyboard from "./components/features/Keyboard/DefaultKeyboard";
import WordsCard from "./components/features/WordsCard/WordsCard";
import {
  SOUND_MODE,
  soundOptions,
  DEFAULT_SOUND_TYPE,
  DEFAULT_SOUND_TYPE_KEY,
} from "./components/features/sound/sound";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import axios from "axios";

export const SetUserContext = createContext();

function App() {
  // localStorage persist theme setting
  const [theme, setTheme] = useState(() => {
    const stickyTheme = window.localStorage.getItem("theme");
    if (stickyTheme !== null) {
      const localTheme = JSON.parse(stickyTheme);
      const upstreamTheme = themesOptions.find(
        (e) => e.label === localTheme.label
      ).value;
      // we will do a deep equal here. In case we want to support customized local theme.
      const isDeepEqual = localTheme === upstreamTheme;
      return isDeepEqual ? localTheme : upstreamTheme;
    }
    return defaultTheme;
  });

  // local persist game mode setting
  const [soundMode, setSoundMode] = useLocalPersistState(false, SOUND_MODE);

  const [soundType, setSoundType] = useLocalPersistState(
    DEFAULT_SOUND_TYPE,
    DEFAULT_SOUND_TYPE_KEY
  );

  // local persist game mode setting
  const [gameMode, setGameMode] = useLocalPersistState(
    GAME_MODE_DEFAULT,
    GAME_MODE
  );

  const [user, setUser] = useState(false);

  const handleGameModeChange = (currGameMode) => {
    setGameMode(currGameMode);
  };

  // localStorage persist focusedMode setting
  const [isFocusedMode, setIsFocusedMode] = useState(
    localStorage.getItem("focused-mode") === "true"
  );

  // musicMode setting
  const [isMusicMode, setIsMusicMode] = useState(false);

  // coffeeMode setting
  const [isCoffeeMode, setIsCoffeeMode] = useState(false);

  // rankingMode setting
  const [isRankingMode, setIsRankingMode] = useState(false);

  // trainer mode setting
  const [isTrainerMode, setIsTrainerMode] = useState(false);

  // words card mode
  const [isWordsCardMode, setIsWordsCardMode] = useLocalPersistState(
    false,
    "IsInWordsCardMode"
  );

  const isWordGameMode =
    gameMode === GAME_MODE_DEFAULT &&
    !isCoffeeMode &&
    !isTrainerMode &&
    !isWordsCardMode;
  const isSentenceGameMode =
    gameMode === GAME_MODE_SENTENCE &&
    !isCoffeeMode &&
    !isTrainerMode &&
    !isWordsCardMode;
  const isRankingGameMode =
    gameMode === GAME_MODE_RANKING &&
    !isCoffeeMode &&
    !isTrainerMode &&
    !isWordsCardMode;

  const handleThemeChange = (e) => {
    window.localStorage.setItem("theme", JSON.stringify(e.value));
    setTheme(e.value);
  };

  const handleSoundTypeChange = (e) => {
    setSoundType(e.label);
  };

  const toggleFocusedMode = () => {
    setIsFocusedMode(!isFocusedMode);
  };

  const toggleSoundMode = () => {
    setSoundMode(!soundMode);
  };

  const toggleMusicMode = () => {
    setIsMusicMode(!isMusicMode);
  };

  const toggleCoffeeMode = () => {
    setIsCoffeeMode(!isCoffeeMode);
    setIsTrainerMode(false);
    setIsWordsCardMode(false);
    setIsRankingMode(false);
  };

  const toggleRankingMode = () => {
    setIsRankingMode(!isRankingMode);
    setIsCoffeeMode(false);
    setIsTrainerMode(false);
    setIsWordsCardMode(false);
  };

  const toggleTrainerMode = () => {
    setIsRankingMode(false);
    setIsTrainerMode(!isTrainerMode);
    setIsCoffeeMode(false);
    setIsWordsCardMode(false);
  };

  const toggleWordsCardMode = () => {
    setIsRankingMode(false);
    setIsTrainerMode(false);
    setIsCoffeeMode(false);
    setIsWordsCardMode(!isWordsCardMode);
  };

  useEffect(() => {
    localStorage.setItem("focused-mode", isFocusedMode);
  }, [isFocusedMode]);

  const textInputRef = useRef(null);
  const focusTextInput = () => {
    textInputRef.current && textInputRef.current.focus();
  };

  const textAreaRef = useRef(null);
  const focusTextArea = () => {
    textAreaRef.current && textAreaRef.current.focus();
  };

  const sentenceInputRef = useRef(null);
  const focusSentenceInput = () => {
    sentenceInputRef.current && sentenceInputRef.current.focus();
  };

  useEffect(() => {
    if (isWordGameMode) {
      focusTextInput();
      return;
    }
    if (isSentenceGameMode) {
      focusSentenceInput();
      return;
    }
    if (isCoffeeMode) {
      focusTextArea();
      return;
    }
    return;
  }, [
    theme,
    isFocusedMode,
    isMusicMode,
    isCoffeeMode,
    isWordGameMode,
    isSentenceGameMode,
    soundMode,
    soundType,
  ]);

  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    const token = cookies.token;

    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/isAuthorized`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        setUser(true);
      })
      .catch((err) => {
        setUser(false);
        console.log("Error feching data!");
      });
  }, [cookies]);


  return (
    <ThemeProvider theme={theme}>
      <SetUserContext.Provider value={setUser}>
      <>
        <GlobalStyles />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <div className="canvas">
                <Logo
                  isFocusedMode={isFocusedMode}
                  isMusicMode={isMusicMode}
                ></Logo>
                {isWordGameMode && (
                  <TypeBox
                    textInputRef={textInputRef}
                    isFocusedMode={isFocusedMode}
                    soundMode={soundMode}
                    soundType={soundType}
                    key="type-box"
                    handleInputFocus={() => focusTextInput()}
                  ></TypeBox>
                )}
                {isSentenceGameMode && (
                  <SentenceBox
                    sentenceInputRef={sentenceInputRef}
                    isFocusedMode={isFocusedMode}
                    soundMode={soundMode}
                    soundType={soundType}
                    key="sentence-box"
                    handleInputFocus={() => focusSentenceInput()}
                  ></SentenceBox>
                )}
                {isRankingGameMode && (
                  <RankingBox
                    sentenceInputRef={sentenceInputRef}
                    isFocusedMode={isFocusedMode}
                    soundMode={soundMode}
                    soundType={soundType}
                    key="sentence-box"
                    handleInputFocus={() => focusSentenceInput()}
                  ></RankingBox>
                )}
                {isCoffeeMode && !isTrainerMode && !isWordsCardMode && (
                  <FreeTypingBox
                    textAreaRef={textAreaRef}
                    soundMode={soundMode}
                    soundType={soundType}
                  />
                )}
                {isTrainerMode && !isCoffeeMode && !isWordsCardMode && (
                  <DefaultKeyboard
                    soundMode={soundMode}
                    soundType={soundType}
                  ></DefaultKeyboard>
                )}
                {isWordsCardMode && !isCoffeeMode && !isTrainerMode && (
                  <WordsCard
                    soundMode={soundMode}
                    soundType={soundType}
                  ></WordsCard>
                )}
                <FooterMenu
                  themesOptions={themesOptions}
                  theme={theme}
                  soundMode={soundMode}
                  toggleSoundMode={toggleSoundMode}
                  soundOptions={soundOptions}
                  soundType={soundType}
                  handleSoundTypeChange={handleSoundTypeChange}
                  handleThemeChange={handleThemeChange}
                  toggleFocusedMode={toggleFocusedMode}
                  toggleMusicMode={toggleMusicMode}
                  toggleCoffeeMode={toggleCoffeeMode}
                  isCoffeeMode={isCoffeeMode}
                  isMusicMode={isMusicMode}
                  isFocusedMode={isFocusedMode}
                  gameMode={gameMode}
                  handleGameModeChange={handleGameModeChange}
                  isTrainerMode={isTrainerMode}
                  toggleTrainerMode={toggleTrainerMode}
                  isWordsCardMode={isWordsCardMode}
                  toggleWordsCardMode={toggleWordsCardMode}
                  toggleRankingMode={toggleRankingMode}
                  isRankingMode={isRankingMode}
                ></FooterMenu>
                <MusicPlayerSnackbar
                  isMusicMode={isMusicMode}
                  isFocusedMode={isFocusedMode}
                  onMouseLeave={() => focusTextInput()}
                ></MusicPlayerSnackbar>
              </div>
            }
          />
          <Route
            path="/login"
            exact
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/sign-up"
            exact
            element={!user ? <SignUp /> : <Navigate to="/" />}
          />
          <Route path="/profile" exact element={<Profile />} />
        </Routes>
      </>
      </SetUserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
