import React, { useEffect, useState, useMemo } from "react";
import { wordsGenerator } from "../../scripts/wordsGenerator";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import IconButton from "../utils/IconButton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

import {
  DEFAULT_COUNT_DOWN,
  COUNT_DOWN_60,
  COUNT_DOWN_30,
  COUNT_DOWN_15,
  DEFAULT_WORDS_COUNT,
} from "../../constants/Constants";

const TypeBox = ({ textInputRef }) => {
  // constants
  const [countDownConstant, setCountDownConstant] =
    useState(DEFAULT_COUNT_DOWN);

  // Caps Lock
  const [capsLocked, setCapsLocked] = useState(false);

  // set up words state
  const [words, setWords] = useState([]);
  const wordSpanRefs = useMemo(
    () =>
      Array(DEFAULT_WORDS_COUNT)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );
  
  
  // set up timer state
  const [countDown, setCountDown] = useState(countDownConstant);
  const [intervalId, setIntervalId] = useState(null);

  // set up game loop status state
  const [status, setStatus] = useState("waiting");
  // set up hidden input input val state
  const [currInput, setCurrInput] = useState("");
  // set up world advancing index
  const [currWordIndex, setCurrWordIndex] = useState(0);
  // set up char advancing index
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [prevInput, setPrevInput] = useState("");

  // set up words examine history
  const [wordsCorrect, setWordsCorrect] = useState(new Set());
  const [wordsInCorrect, setWordsInCorrect] = useState(new Set());
  const [inputWordsHistory, setInputWordsHistory] = useState({});
  const [rawKeyStrokes, setRawKeyStrokes] = useState(0);
  // const currRowKeys = Object.values(inputWordsHistory).map((val) => val.length).reduce(
  //   ( a, b ) => a + b,
  //   0
  // );

  // setup stats
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  // set up char examine hisotry
  const [history, setHistory] = useState({});
  const keyString = currWordIndex + "." + currCharIndex;
  const [currChar, setCurrChar] = useState("");

  useEffect(() => {
    setWords(wordsGenerator(DEFAULT_WORDS_COUNT));
  }, []);

  useEffect(() => {
    if (
      currWordIndex !== 0 &&
      wordSpanRefs[currWordIndex].current.offsetLeft <
        wordSpanRefs[currWordIndex - 1].current.offsetLeft
    ) {
      wordSpanRefs[currWordIndex - 1].current.scrollIntoView();
    } else {
      return;
    }
  }, [currWordIndex, wordSpanRefs]);

  function reset(newCountDown) {
    setStatus("waiting");
    setWords(wordsGenerator(DEFAULT_WORDS_COUNT));
    setCountDownConstant(newCountDown);
    setCountDown(newCountDown);
    clearInterval(intervalId);
    setWpm(0);
    setAccuracy(0);
    setRawKeyStrokes(0);
    setCurrInput("");
    setPrevInput("");
    setIntervalId(null);
    setCurrWordIndex(0);
    setCurrCharIndex(-1);
    setCurrChar("");
    setHistory({});
    setInputWordsHistory({});
    setWordsCorrect(new Set());
    setWordsInCorrect(new Set());
    textInputRef.current.focus();
    // console.log("fully reset waiting for next inputs");
    wordSpanRefs[0].current.scrollIntoView();
  }

  function start() {
    if (status === "finished") {
      setWords(wordsGenerator(DEFAULT_WORDS_COUNT));
      setCurrWordIndex(0);
      setCurrCharIndex(-1);
      setCurrChar("");
      setHistory({});
      setInputWordsHistory({});
      setWordsCorrect(new Set());
      setWordsInCorrect(new Set());
      setStatus("waiting");
      textInputRef.current.focus();
    }

    if (status !== "started") {
      setStatus("started");
      let intervalId = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(intervalId);    
            setStatus("finished");
            setCurrInput("");
            setPrevInput("");
            return countDownConstant;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
      setIntervalId(intervalId);
    }
  }

  function UpdateInput(e) {
    if (status === "finished") {
      return;
    }
    setCurrInput(e.target.value);
    inputWordsHistory[currWordIndex] = e.target.value.trim();
    setInputWordsHistory(inputWordsHistory);
  }

  function handleKeyUp(e) {
    setCapsLocked(e.getModifierState("CapsLock"));
  }

  function handleKeyDown(e) {
    const key = e.key;
    const keyCode = e.keyCode;
    setCapsLocked(e.getModifierState("CapsLock"));

    // keydown count for KPM calculations to all types of operations
    setRawKeyStrokes((rawKeyStrokes + 1));

    // disable tab key
    if (keyCode === 9) {
      e.preventDefault();
    }

    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
      return;
    }

    // start the game by typing any thing
    if (status !== "started" && status !== "finished") {
      start();
    }

    // update stats when typing
    const currWpm =
      (wordsCorrect.size / (countDownConstant - countDown)) * 60.0;
    setWpm(currWpm);
    const currAccuracy = (wordsCorrect.size/(currWordIndex))*100;
    setAccuracy(currAccuracy);
    
    // space bar
    if (keyCode === 32) {
      const prevCorrectness = checkPrev();
      // advance to next regardless prev correct/not
      if (prevCorrectness === true || prevCorrectness === false) {
        // reset currInput
        setCurrInput("");
        // advance to next
        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(-1);
        return;
      } else {
        // but don't allow entire word skip
        // console.log("entire word skip not allowed");
        return;
      }

      // backspace
    } else if (keyCode === 8) {
      // delete the mapping match records
      delete history[keyString];

      // avoid over delete
      if (currCharIndex < 0) {
        // only allow delete prev word, rewind to previous
        if (wordsInCorrect.has(currWordIndex - 1)) {
          // console.log("detected prev incorrect, rewinding to previous");
          const prevInputWord = inputWordsHistory[currWordIndex - 1];
          // console.log(prevInputWord + " ")
          setCurrInput(prevInputWord + " ");
          setCurrCharIndex(prevInputWord.length - 1);
          setCurrWordIndex(currWordIndex - 1);
          setPrevInput(prevInputWord);
        }
        return;
      }
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
      return;
    } else {
      if (keyCode >= 65 && keyCode <= 90) {
        setCurrCharIndex(currCharIndex + 1);
        setCurrChar(key);
      } else {
        return;
      }
    }
  }

  const getExtraCharsDisplay = (word, i) => {
    let input = inputWordsHistory[i];
    if (!input) {
      input = currInput.trim();
    }
    if (i > currWordIndex) {
      return null;
    }
    if (input.length <= word.length) {
      return null;
    } else {
      const extra = input.slice(word.length, input.length);
      return extra.split("").map((c, idx) => (
          <span key={idx} className="error-char">
            {c}
          </span>
      ));
    }
  };

  function checkPrev() {
    const wordToCompare = words[currWordIndex];
    const currInputWithoutSpaces = currInput.trim();
    const isCorrect = wordToCompare === currInputWithoutSpaces;
    if (!currInputWithoutSpaces || currInputWithoutSpaces.length === 0) {
      return null;
    }
    if (isCorrect) {
      // console.log("detected match");
      wordsCorrect.add(currWordIndex);
      wordsInCorrect.delete(currWordIndex);
      let inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      // reset prevInput to empty (will not go back)
      setPrevInput("");
      return true;
    } else {
      // console.log("detected unmatch");
      wordsInCorrect.add(currWordIndex);
      wordsCorrect.delete(currWordIndex);
      let inputWordsHistoryUpdate = { ...inputWordsHistory };
      inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
      setInputWordsHistory(inputWordsHistoryUpdate);
      // append currInput to prevInput
      setPrevInput(prevInput + " " + currInputWithoutSpaces);
      return false;
    }
  }
  function getWordClassName(wordIdx) {
    if (wordsInCorrect.has(wordIdx)) {
      return "word error-word";
    } else {
      return "word";
    }
  }

  function getCharClassName(wordIdx, charIdx, char) {
    const keyString = wordIdx + "." + charIdx;
    if (history[keyString] === true) {
      return "correct-char";
    }
    if (history[keyString] === false) {
      return "error-char";
    }
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        history[keyString] = true;
        return "correct-char";
      } else {
        history[keyString] = false;
        return "error-char";
      }
    } else if (
      wordIdx === currWordIndex &&
      currCharIndex >= words[currWordIndex].length
    ) {
      return "error-char";
    } else {
      return "";
    }
  }

  return (
    <>
      <div>
        <Snackbar
          open={capsLocked}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Slide in={capsLocked} mountOnEnter unmountOnExit>
            <Alert className="alert" severity="warning" sx={{ width: "100%" }}>
              Caps Locked
            </Alert>
          </Slide>
        </Snackbar>
      </div>
      <div className="type-box">
        <div className="words">
          {words.map((word, i) => (
            <span key={i} ref={wordSpanRefs[i]} className={getWordClassName(i)}>
              {word.split("").map((char, idx) => (
                <span
                  key={"word" + idx}
                  className={getCharClassName(i, idx, char)}
                >
                  {char}
                </span>
              ))}
              {getExtraCharsDisplay(word, i)}
            </span>
          ))}
        </div>
      </div>
      <div className="stats">
        <h3>{countDown} s </h3>
        <Box display="flex" flexDirection="row">
        <h3>WPM: {Math.round(wpm)}</h3>
        {status === 'finished' &&<h4>Words Accuracy: {Math.round(accuracy)} %</h4>}
        {status === 'finished' &&<h4>Raw KPM: {Math.round(rawKeyStrokes/(countDownConstant) * 60.0)}</h4>}
        </Box>
        <div className="restart-button" key="restart-button">
          <Grid container justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="row">
              <IconButton
                aria-label="restart"
                color="secondary"
                size="medium"
                onClick={() => {
                  reset(countDownConstant);
                }}
              >
                <RestartAltIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  reset(COUNT_DOWN_60);
                }}
              >
                60
              </IconButton>
              <IconButton
                onClick={() => {
                  reset(COUNT_DOWN_30);
                }}
              >
                30
              </IconButton>
              <IconButton
                onClick={() => {
                  reset(COUNT_DOWN_15);
                }}
              >
                15
              </IconButton>
            </Box>
          </Grid>
        </div>
      </div>
      <input
        key="hidden-input"
        ref={textInputRef}
        type="text"
        className="hidden-input"
        onKeyDown={(e) => handleKeyDown(e)}
        onKeyUp={(e) => handleKeyUp(e)}
        value={currInput}
        onChange={(e) => UpdateInput(e)}
      />
    </>
  );
};

export default TypeBox;
