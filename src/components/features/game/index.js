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
    requestWord();
    hiddenInputRef.current.value = "";
    clearInterval(timer); // Clear the timer
    setTimer(null)
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

  const allVisibleRevealed = () => {
    for (let i = 0; i < currWord.length; i++) {
      if ((i === 0 || visibleIndex.includes(i)) && currInput[i] !== currWord[i]) {
        return false;
      }
    }
    return true;
  }

  const getCharClassName = (idx, char) => {
    if (currWord.length <= currInput.length) {
      if (currInput.length === currWord.length ) {
        if(allVisibleRevealed() && isWordPresent(currInput))
          return "correct-wordcard-char";
        return "wordcard-error-char";
      }
      return "wordcard-error-char";
    }
    if(idx === 0 || visibleIndex.includes(idx)){
      if(currInput[idx] && char !== currInput[idx]){
        return "wordcard-error-char";
      }
    }
    if (idx < currInput.length) {
      if (char === " ") {
        return "error-wordcard-space-char";
      }
      return "correct-wordcard-char";
    }
    return "wordcard-char";
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
        if (guessWord === currInput || isWordPresent(currInput)) {
          e.preventDefault();
          requestWord();
          setProgress((prev) => Math.min(prev + 2, 100));
          setCurrInput("");
          hiddenInputRef.current.value = "";
          setGuessedWordsCount((prev) => prev + 1); // Increment guessed words count
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