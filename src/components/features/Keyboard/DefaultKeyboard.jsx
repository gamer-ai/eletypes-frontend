import React from "react";
import { useRef, useEffect, useState } from "react";
import { Box } from "@mui/system";
import IconButton from "../../utils/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import useSound from "use-sound";
import { SOUND_MAP } from "../sound/sound";

const DefaultKeyboard = ({ soundType, soundMode }) => {
  const keyboardRef = useRef();
  const [inputChar, setInputChar] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [play] = useSound(SOUND_MAP[soundType], { volume: 0.5 });

  const accuracy =
    correctCount + incorrectCount === 0
      ? 0
      : Math.floor((correctCount / (correctCount + incorrectCount)) * 100);
  const keys = [..." abcdefghijklmnopqrstuvwxyz "];
  const resetStats = () => {
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  useEffect(() => {
    keyboardRef.current && keyboardRef.current.focus();
  });
  const handleInputBlur = (event) => {
    keyboardRef.current && keyboardRef.current.focus();
  };
  const handleKeyDown = (event) => {
    if (soundMode) {
      play();
    }
    setInputChar(event.key);
    event.preventDefault();
    return;
  };
  const handleKeyUp = (event) => {
    setInputChar("");
    if (event.key === randomKey) {
      let newRandom = getRandomKeyIndex();
      let newKey = keys[newRandom];
      if (newKey === randomKey) {
        if (newRandom === 0 || newRandom === keys.length - 1) {
          newRandom = 1;
        } else {
          newRandom = newRandom + 1;
        }
      }
      setRandomKey(keys[newRandom]);
      setCorrectCount(correctCount + 1);
      return;
    }

    setIncorrectCount(incorrectCount + 1);

    event.preventDefault();
    return;
  };
  const getRandomKeyIndex = () => {
    return Math.floor(Math.random() * 27);
  };

  const [randomKey, setRandomKey] = useState(() => {
    return keys[getRandomKeyIndex()];
  });

  const getClassName = (keyString) => {
    if (keyString !== randomKey) {
      if (inputChar !== "" && inputChar === keyString) {
        return "UNITKEY VIBRATE-ERROR";
      }
      return "UNITKEY";
    }
    if (inputChar !== "" && inputChar === keyString) {
      return "UNITKEY NOVIBRATE-CORRECT";
    }
    return "UNITKEY VIBRATE";
  };
  const getSpaceKeyClassName = () => {
    if (" " !== randomKey) {
      if (inputChar !== "" && inputChar === " ") {
        return "SPACEKEY VIBRATE-ERROR";
      }
      return "SPACEKEY";
    }
    if (inputChar !== "" && inputChar === " ") {
      return "SPACEKEY NOVIBRATE-CORRECT";
    }
    return "SPACEKEY VIBRATE";
  };

  const lettersRow1 = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "[",
    "]",
  ];

  const row1Elements = lettersRow1.map((letter, index) => (
    <div className={getClassName(letter.toLowerCase())} key={index} id={letter}>
      {letter}
    </div>
  ));

  const lettersRow2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"];

  const row2Elements = lettersRow2.map((letter, index) => (
    <div className={getClassName(letter.toLowerCase())} key={index} id={letter}>
      {letter}
    </div>
  ));

  const lettersRow3 = ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"];

  const row3Elements = lettersRow3.map((letter, index) => (
    <div className={getClassName(letter.toLowerCase())} key={index} id={letter}>
      {letter}
    </div>
  ));

  return (
    <div>
      <div className="keyboard">
        <input
          className="hidden-input"
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          ref={keyboardRef}
        ></input>
        <ul className="row row-1">{row1Elements}</ul>
        <ul className="row row-2">{row2Elements}</ul>
        <ul className="row row-3">{row3Elements}</ul>
        <ul className="row row-4">
          <div className={getSpaceKeyClassName()} id="SPACE">
            SPACE
          </div>
        </ul>{" "}
      </div>
      <div className="keyboard-stats">
        <Box display="flex" flexDirection="row">
          <h3>Accuracy: {accuracy} %</h3>
          <h3>
            <span className="CorrectKeyDowns">{correctCount}</span>
            {"  "} {"/"} {"  "}
            <span className="IncorrectKeyDowns">{incorrectCount}</span>
          </h3>
          <IconButton
            aria-label="restart"
            size="small"
            onClick={() => {
              resetStats();
            }}
          >
            <RestartAltIcon />
          </IconButton>
        </Box>
      </div>
    </div>
  );
};

export default DefaultKeyboard;
