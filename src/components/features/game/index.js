import useSound from "use-sound";
import { SOUND_MAP } from "../sound/sound";
import { useState, useEffect, useRef } from "react";
import { getRandomWord, initData, isWordPresent } from "./util";
import useLocalPersistState from "../../../hooks/useLocalPersistState";
import { Box, Dialog, DialogActions, DialogTitle, Grid, Tooltip, Button } from "@mui/material";
import IconButton from "../../utils/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { HINT_BUTTON_TOOLTIP_TITLE, HINT_LIMIT, RESET_BUTTON_TOOLTIP_TITLE } from "../../../constants/Constants";
import LinearProgress from "@mui/material/LinearProgress";
import RestoreIcon from '@mui/icons-material/Restore';


const GameComponent = ({ soundType, soundMode }) => {
  const [play] = useSound(SOUND_MAP[soundType], { volume: 0.5 });
  //easy, medium, hard
  const [difficulty, setDifficulty] = useLocalPersistState("easy", "game-difficulty");
  const [guessWord, setGuessWord] = useLocalPersistState("","guessWord");
  const [progress, setProgress] = useState(100); // Progress bar value
  const [timer, setTimer] = useState(null); // Timer reference
  const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false); // State for game over dialog
  const [guessedWordsCount, setGuessedWordsCount] = useState(0); 
  const [highScore, setHighScore] = useLocalPersistState(0, "highscore"); // High score tracker

  // set up game loop status state
  const [status, setStatus] = useState("waiting");
  const [visibleIndex, setVisibleIndex] = useState([]);

  const [currInput, setCurrInput] = useState("");

  const hiddenInputRef = useRef();

  const start = () => {
    if (status === "finished") {
      return;
    }
    if (status !== "started") {
      setStatus("started");
      startTimer();
    }
  };

  const restartGame = () => {
    setStatus("waiting");
    setCurrInput("");
    setProgress(100); // Reset progress bar
    setVisibleIndex([]);
    setGuessedWordsCount(0); // Reset guessed words count
    requestWord();
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = "";
      hiddenInputRef.current.focus(); // Refocus the input field
  }
    clearInterval(timer); // Clear the timer
    setTimer(null);
    setGameOverDialogOpen(false); // Close the game over dialog
  };

  const startTimer = () => {
    clearInterval(timer); // Clear any existing timer
    const newTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(newTimer);
          setStatus("finished"); // End the game when the timer reaches 0
          return 0;
        }
        return prev - 1; // Decrease progress by 1% every second
      });
    }, 1000);
    setTimer(newTimer);
  };

  const currWord = guessWord;
  const handleInputBlur = (event) => {
    hiddenInputRef.current && hiddenInputRef.current.focus();
  };

  const handleInputChange = (e) => {
    setCurrInput(e.target.value);
    hiddenInputRef.current.value = e.target.value;
    e.preventDefault();
  };
  useEffect(() => {
      hiddenInputRef.current && hiddenInputRef.current.focus();
      initData();
      requestWord();
    }, []);
    useEffect(() => {
      // Call requestWord whenever difficulty changes
      requestWord();
    }, [difficulty]);
    // Show game over dialog when the game ends
  useEffect(() => {
    if (status === "finished") {
      setGameOverDialogOpen(true); // Open the game over dialog
    }
  }, [status]);

  useEffect(() => {
      hiddenInputRef.current.value = "";
      setCurrInput("");
      let random = 0
      while (random===0 && guessWord){
        random = Math.floor(guessWord.length * Math.random())
      }
      setVisibleIndex([random]);
    }, [guessWord]);

  useEffect(() => {
    // Reset guessed words count and request a new word when difficulty changes
    setGuessedWordsCount(0);
    requestWord();
  }, [difficulty]);

  const allVisibleRevealed = () => {
    for (let i = 0; i < currWord.length; i++) {
      if ((i === 0 || visibleIndex.includes(i)) && currInput[i] !== currWord[i]) {
        return false;
      }
    }
    return isWordPresent(currInput);
  }

  const getCharClassName = (idx, char) => {
    const wordClass = ["wordcard-error-char", "correct-wordcard-char", "wordcard-char", "error-wordcard-space-char"];
    
    // case 1. If the input is longer than or equal to the word length, all chars are wrong.
    if(currInput.length > currWord.length){
      return wordClass[0];  // error char
    }

    // Case 2: If the input length equal to the word length.
    if (currWord.length === currInput.length) {
      // if all visible chars are correct and the word is valid, show correct char, otherwise show error char.
      return allVisibleRevealed() ? wordClass[1] : wordClass[0];
    }

    // Case 3: If the input length is less than the word length, check the visible chars. If the char is visible and not correct, show error char. If the char is typed but not visible, show correct char if it's correct, otherwise show error char. If the char is not typed, show default char.
    if(idx === 0 || visibleIndex.includes(idx)){
      if(currInput[idx] && char !== currInput[idx]){
        return wordClass[0]; // error char
      }
    }
    if (idx < currInput.length) {
      // if the char is space, show error space char, otherwise show correct char
      return char === " " ? wordClass[3] : wordClass[1]; 
    }
    return wordClass[2]; // default char
  };
  
  const getExtraCharClassName = (char) => {
    if (char === " ") {
      return "wordcard-error-char-space-char";
    }
    return "wordcard-error-char";
  };

  const extra = currInput.slice(guessWord.length, currInput.length).split("");
  const getCharDisplay = (idx, char) => {
    if ( visibleIndex.includes(idx) || idx === 0) {
        return char;
    }
    if(idx < currInput.length){
      return currInput[idx];
    }
    return "_";
  };

  const handleReset = () => {
    if (status !== "started") {
      start(); // Start the game if it's not already started
    }
    requestWord();
    hiddenInputRef.current.value = "";
    setProgress((prev) => Math.min(prev - 2, 100)); // Increase progress by 2% for reset
  }

  const requestWord = () => {
    const difficultyRanges = {
      easy: { min: 3, max: 4 },
      medium: { min: 5, max: 7 },
      hard: { min: 8, max: 20 },
    };
    const { min, max } = difficultyRanges[difficulty] || difficultyRanges["easy"]; 
    const newWord = getRandomWord(min, max);

    if (newWord !== guessWord) {
      setGuessWord(newWord);
    }
  }

  const handleDisable = () =>{
    return visibleIndex.length > HINT_LIMIT || visibleIndex.length + 2 === currWord.length;
  }
  const handleHint = () => {
    if (status !== "started") {
      start(); // Start the game if it's not already started
    }
    if (visibleIndex.length > HINT_LIMIT || visibleIndex.length === currWord.length - 2) {
      return;
    }
    let newVisibleIndex = [...visibleIndex];
    let random = 0
    while (currWord && (newVisibleIndex.includes(random) || random === 0)) {
      random = Math.floor(currWord.length * Math.random())
    }
    newVisibleIndex.push(random);
    setVisibleIndex(newVisibleIndex);
    setProgress((prev) => Math.min(prev - 1, 100)); // Increase progress by 1% for hint
  }
  const getModeActivation = (type) => {
    // return "active-button" ;
    return difficulty === type ? "active-button" : "inactive-button"
  }

  const handleKeyDown = (e) => {
    if (soundMode) {
      play();
    }
    const keyCode = e.keyCode;

    // disable tab key
    if (keyCode === 9) {
      e.preventDefault();
      return;
    }

    if (status === "finished") {
      e.preventDefault();
      return;
    }

    // start the game by typing any thing
    if (status !== "started" && status !== "finished") {
      start();
      return;
    }

    // Handle word completion
    if (currInput.length >= guessWord.length) {
      if (keyCode === 13 || keyCode === 32) {
        if (guessWord === currInput || (currWord.length === currInput.length && allVisibleRevealed())) {
          e.preventDefault();
          requestWord();
          setProgress((prev) => Math.min(prev + 2, 100));
          setCurrInput("");
          hiddenInputRef.current.value = "";
          setGuessedWordsCount((prev) => {
            const newCount = prev + 1;
            setHighScore((highScore) => Math.max(highScore, newCount)); // Update high score if needed
            return newCount;
          });
        }
        return;
      }
      return;
    }
  };

  return (
    <div className="game-card-container">
      <div className="words-card-main">
        <input
          className="hidden-input"
          ref={hiddenInputRef}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e)}
        ></input>
        <div className="wordcard-word-display-field">
          {currWord.split("").map((char, idx) => (
            <span key={"word" + idx} className={getCharClassName(idx, char)}>
              {getCharDisplay(idx, char)}
            </span>
          ))}
          {extra.map((char, idx) => (
            <span
              key={"wordextra" + idx}
              className={getExtraCharClassName(char)}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="wordscard-UI">
          <div className="restart-button-game" key="restart-button">
            <Grid container justifyContent="center" alignItems="center">
                <Box display="flex" flexDirection="row">
                  <IconButton
                    aria-label="restart"
                    color="secondary"
                    size="medium"
                    onClick={handleHint}
                    disabled={handleDisable()}
                  >
                    <Tooltip title={HINT_BUTTON_TOOLTIP_TITLE}>
                      <LightbulbIcon />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    aria-label="restart"
                    color="secondary"
                    size="medium"
                    onClick={handleReset}
                  >
                    <Tooltip title={RESET_BUTTON_TOOLTIP_TITLE}>
                      <RestartAltIcon />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                  aria-label="restart-game"
                  color="primary"
                  size="medium"
                  onClick={restartGame}
                >
                  <Tooltip title={"Restart Game"}>
                    <RestoreIcon />
                  </Tooltip>
                </IconButton>
                </Box>
                <Box>
                  <IconButton onClick={() => setDifficulty("easy")}>
                    <Tooltip title={"Easy Mode"}>
                      <span className={getModeActivation("easy")}>Easy</span>
                    </Tooltip>
                  </IconButton>
                  <IconButton onClick={() => setDifficulty("medium")}>
                    <Tooltip title={"Medium Mode"}>
                      <span className={getModeActivation("medium")}>Medium</span>
                    </Tooltip>
                  </IconButton>
                  <IconButton onClick={() => setDifficulty("hard")}>
                    <Tooltip title={"Hard Mode"}>
                      <span className={getModeActivation("hard")}>Hard</span>
                    </Tooltip>
                  </IconButton>
                </Box>
                <Box p={2}>
                  <p className="inactive-button">You guessed {guessedWordsCount} words correctly!</p>
                  <p className="inactive-button">High Score: {highScore}</p>
                </Box>
                  
            </Grid>
          </div>
        </div>
        <Box width="100%" mt={2} title="Progress Bar">
            <LinearProgress
              variant="determinate"
              value={progress}
            />
        </Box>
      </div>
      <Dialog open={gameOverDialogOpen} onClose={() => setGameOverDialogOpen(false)}>
        <DialogTitle>Game Over</DialogTitle>
        <DialogActions style={{ flexDirection: "column" }}>
          <p style={{ marginBottom: "10px" }}>
          The word was: <strong>{currWord}</strong>
          </p>
      </DialogActions>
        <DialogActions>
          <Button onClick={restartGame} color="primary">
            Restart Game
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GameComponent;