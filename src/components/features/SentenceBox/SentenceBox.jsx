import React from "react";
import { useState, useMemo, useEffect } from "react";
import { sentencesGenerator } from "../../../scripts/sentencesGenerator";
import { Stack } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import IconButton from "../../utils/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import UndoIcon from "@mui/icons-material/Undo";
import {
  DEFAULT_SENTENCES_COUNT,
  TEN_SENTENCES_COUNT,
  FIFTEEN_SENTENCES_COUNT,
  RESTART_BUTTON_TOOLTIP_TITLE,
  REDO_BUTTON_TOOLTIP_TITLE,
} from "../../../constants/Constants";
import useLocalPersistState from "../../../hooks/useLocalPersistState";
import {
  ENGLISH_MODE,
  CHINESE_MODE,
  ENGLISH_SENTENCE_MODE_TOOLTIP_TITLE,
  CHINESE_SENTENCE_MODE_TOOLTIP_TITLE,
} from "../../../constants/Constants";
import { Tooltip } from "@mui/material";
import { Dialog } from "@mui/material";
import { DialogTitle } from "@mui/material";
import SentenceBoxStats from "./SentenceBoxStats";
import { SOUND_MAP } from "../sound/sound";
import useSound from "use-sound";

const SentenceBox = ({
  sentenceInputRef,
  handleInputFocus,
  isFocusedMode,
  soundMode,
  soundType,
}) => {
  const [play] = useSound(SOUND_MAP[soundType], { volume: 0.5 });

  // local persist timer
  const [sentencesCountConstant, setSentencesCountConstant] =
    useLocalPersistState(DEFAULT_SENTENCES_COUNT, "sentences-constant");

  // local persist difficulty
  const [language, setLanguage] = useLocalPersistState(
    ENGLISH_MODE,
    "sentences-language"
  );

  // tab-enter restart dialog
  const [openRestart, setOpenRestart] = useState(false);
  const EnterkeyPressReset = (e) => {
    // press enter/or tab to reset;
    if (e.keyCode === 13 || e.keyCode === 9) {
      e.preventDefault();
      setOpenRestart(false);
      reset(sentencesCountConstant, language, false);
    } else if (e.keyCode === 32) {
      e.preventDefault();
      setOpenRestart(false);
      reset(sentencesCountConstant, language, true);
    } else {
      e.preventDefault();
      setOpenRestart(false);
    }
  };

  const handleTabKeyOpen = () => {
    setOpenRestart(true);
  };

  const getSentencesCountButtonClassName = (buttonSentencesCountConstant) => {
    if (buttonSentencesCountConstant === sentencesCountConstant) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getLanguageButtonClassName = (buttonLanguage) => {
    if (language === buttonLanguage) {
      return "active-button";
    }
    return "inactive-button";
  };

  // set up game loop status state
  const [status, setStatus] = useState("waiting");

  // set up stop watch in seconds
  const [time, setTime] = useState(0);

  // set up stop watch running status
  const [timeRunning, setTimeRunning] = useState(false);

  // stop watch loop
  useEffect(() => {
    let interval;
    if (timeRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!timeRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timeRunning]);

  // set up sentences
  const [sentencesDict, setSentencesDict] = useState(() => {
    return sentencesGenerator(sentencesCountConstant, language);
  });
  // enable menu
  const menuEnabled = !isFocusedMode || status === "finished";

  const sentences = useMemo(() => {
    return sentencesDict.map((e) => e.val);
  }, [sentencesDict]);

  // set up currSentenceIndex
  const [currSentenceIndex, setCurrSentenceIndex] = useState(0);

  const currSentence = sentences[currSentenceIndex];

  // set up curr input
  const [currInput, setCurrInput] = useState("");

  // set up stats kpm
  const [rawKeyStroke, setRawKeyStroke] = useState(0);

  const wpm = time < 1 ? 0 : ((rawKeyStroke / time) * 60) / 5;

  const reset = (newSentencesCountConstant, newLanguage, isRedo) => {
    setStatus("watiting");
    setSentencesCountConstant(newSentencesCountConstant);
    setLanguage(newLanguage);
    if (!isRedo) {
      setSentencesDict(
        sentencesGenerator(newSentencesCountConstant, newLanguage)
      );
    }
    setTimeRunning(false);
    setTime(0);
    setCurrSentenceIndex(0);
    setCurrInput("");
    sentenceInputRef.current.focus();
    sentenceInputRef.current.value = "";
    setRawKeyStroke(0);
    setStats({
      correct: 0,
      incorrect: 0,
      extra: 0,
    });
  };

  const start = () => {
    if (status === "finished") {
      reset(sentencesCountConstant, language, false);
    }
    if (status !== "started") {
      setStatus("started");
      setTimeRunning(true);
    }
  };

  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    extra: 0,
  });

  const checkAndUpdateStats = (currSentence, currInput) => {
    const newStats = stats;
    for (let i = 0; i < currSentence.length; i++) {
      if (currSentence[i] === currInput[i]) {
        newStats.correct++;
      } else {
        newStats.incorrect++;
      }
    }
    const deltaCharDifference = currInput.length - currSentence.length;

    if (deltaCharDifference > 0) {
      newStats.extra = deltaCharDifference;
    }

    setStats(newStats);
  };

  const handleKeyDown = (e) => {
    if (status !== "finished" && soundMode) {
      play();
    }
    const keyCode = e.keyCode;
    // disable tab key
    if (keyCode === 9) {
      e.preventDefault();
      handleTabKeyOpen();
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

    setRawKeyStroke(rawKeyStroke + 1);

    // if enter key pressed.
    // advance to next sentence only if the input val length is equal to the current sentence char count);

    if (keyCode === 13) {
      if (currInput.length >= sentences[currSentenceIndex].length) {
        checkAndUpdateStats(currSentence, currInput);
        if (currSentenceIndex + 1 === sentencesCountConstant) {
          setStatus("finished");
          setTimeRunning(false);
          return;
        }
        setCurrSentenceIndex(currSentenceIndex + 1);
        setCurrInput("");
        sentenceInputRef.current.value = "";
        return;
      }
      return;
    }
  };

  const getCharClassName = (idx, char) => {
    if (idx < currInput.length) {
      if (currInput[idx] === char) {
        return "correct-sentence-char";
      }
      if (char === " ") {
        return "error-sentence-space-char";
      }
      return "error-sentence-char";
    }
    return "sentence-char";
  };

  let isOnComposition = false;

  const isChrome = !!window.chrome;

  const handleComposition = (e) => {
    const {
      type,
      currentTarget: { value },
    } = e;
    if (type === "compositionend") {
      // composition finished
      isOnComposition = false;
      if (
        e.currentTarget instanceof HTMLInputElement &&
        !isOnComposition &&
        isChrome
      ) {
        setCurrInput(value);
      }
    } else {
      // composition ongoing
      isOnComposition = true;
    }
  };

  const handleChange = (e) => {
    const {
      currentTarget: { value },
    } = e;
    if (e.currentTarget instanceof HTMLInputElement && !isOnComposition) {
      setCurrInput(value);
    }
  };

  return (
    <div onClick={handleInputFocus}>
      <div className="type-box-sentence">
        <Stack spacing={2}>
          <div className="sentence-display-field">
            {currSentence.split("").map((char, idx) => (
              <span key={"word" + idx} className={getCharClassName(idx, char)}>
                {char}
              </span>
            ))}
          </div>
          <input
            key="hidden-sentence-input"
            ref={sentenceInputRef}
            type="text"
            spellCheck="false"
            className="sentence-input-field"
            onKeyDown={(e) => handleKeyDown(e)}
            onCompositionStart={handleComposition}
            onCompositionUpdate={handleComposition}
            onCompositionEnd={handleComposition}
            onChange={handleChange}
          />
          {status !== "finished" && (
            <span className="next-sentence-display">
              {"->"} {sentences[currSentenceIndex + 1] ?? "Press ↵ to finish."}
            </span>
          )}
        </Stack>
      </div>
      <div className="stats">
        <SentenceBoxStats
          countDown={time}
          wpm={wpm}
          status={status}
          stats={stats}
          rawKeyStrokes={rawKeyStroke}
        ></SentenceBoxStats>

        <div className="restart-button" key="restart-button">
          <Grid container justifyContent="center" alignItems="center">
            <Box display="flex" flexDirection="row">
              <IconButton
                aria-label="redo"
                color="secondary"
                size="medium"
                onClick={() => {
                  reset(sentencesCountConstant, language, true);
                }}
              >
                <Tooltip title={REDO_BUTTON_TOOLTIP_TITLE}>
                  <UndoIcon />
                </Tooltip>
              </IconButton>
              <IconButton
                aria-label="restart"
                color="secondary"
                size="medium"
                onClick={() => {
                  reset(sentencesCountConstant, language, false);
                }}
              >
                <Tooltip title={RESTART_BUTTON_TOOLTIP_TITLE}>
                  <RestartAltIcon />
                </Tooltip>
              </IconButton>
              {menuEnabled && (
                <>
                  <IconButton
                    onClick={() => {
                      reset(DEFAULT_SENTENCES_COUNT, language, false);
                    }}
                  >
                    <span
                      className={getSentencesCountButtonClassName(
                        DEFAULT_SENTENCES_COUNT
                      )}
                    >
                      {DEFAULT_SENTENCES_COUNT}
                    </span>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      reset(TEN_SENTENCES_COUNT, language, false);
                    }}
                  >
                    <span
                      className={getSentencesCountButtonClassName(
                        TEN_SENTENCES_COUNT
                      )}
                    >
                      {TEN_SENTENCES_COUNT}
                    </span>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      reset(FIFTEEN_SENTENCES_COUNT, language, false);
                    }}
                  >
                    <span
                      className={getSentencesCountButtonClassName(
                        FIFTEEN_SENTENCES_COUNT
                      )}
                    >
                      {FIFTEEN_SENTENCES_COUNT}
                    </span>
                  </IconButton>
                  <IconButton>
                    {" "}
                    <span className="menu-separator"> | </span>{" "}
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      reset(sentencesCountConstant, ENGLISH_MODE, false);
                    }}
                  >
                    <Tooltip title={ENGLISH_SENTENCE_MODE_TOOLTIP_TITLE}>
                      <span
                        className={getLanguageButtonClassName(ENGLISH_MODE)}
                      >
                        eng
                      </span>
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      reset(sentencesCountConstant, CHINESE_MODE, false);
                    }}
                  >
                    <Tooltip title={CHINESE_SENTENCE_MODE_TOOLTIP_TITLE}>
                      <span
                        className={getLanguageButtonClassName(CHINESE_MODE)}
                      >
                        chn
                      </span>
                    </Tooltip>
                  </IconButton>
                </>
              )}
            </Box>
          </Grid>
        </div>
      </div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        open={openRestart}
        onKeyDown={EnterkeyPressReset}
      >
        <DialogTitle>
          <div>
            <span className="key-note"> press </span>
            <span className="key-type">Space</span>{" "}
            <span className="key-note">to redo</span>
          </div>
          <div>
            <span className="key-note"> press </span>
            <span className="key-type">Tab</span>{" "}
            <span className="key-note">/</span>{" "}
            <span className="key-type">Enter</span>{" "}
            <span className="key-note">to restart</span>
          </div>
          <span className="key-note"> press </span>
          <span className="key-type">any key </span>{" "}
          <span className="key-note">to exit</span>
        </DialogTitle>
      </Dialog>
    </div>
  );
};

export default SentenceBox;
