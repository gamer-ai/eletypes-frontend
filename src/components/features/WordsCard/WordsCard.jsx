import React from "react";
import { useState, useEffect, useRef } from "react";
import { DICTIONARY_SOURCE_CATALOG } from "../../../constants/DictionaryConstants";
import { useLocale } from "../../../context/LocaleContext";
import useLocalPersistState from "../../../hooks/useLocalPersistState";
import { wordsCardVocabGenerator } from "../../../scripts/wordsGenerator";
import { Grid, Box, Tooltip } from "@mui/material";
import IconButton from "../../utils/IconButton";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import useSound from "use-sound";
import { SOUND_MAP } from "../sound/sound";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import ShuffleIcon from "@mui/icons-material/Shuffle";

const WordsCard = ({ soundType, soundMode }) => {
  // set up game loop status state
  const { t } = useLocale();
  const [status, setStatus] = useState("waiting");

  const [mode, setMode] = useLocalPersistState("vocab", "mode");  // selective, vocab

  const [selectiveWord, setSelectiveWord] = useLocalPersistState("word","");

  const [play] = useSound(SOUND_MAP[soundType], { volume: 0.5 });

  const [showCatalog, setShowCatalog] = useState(false);

  const [hideWord, setHideWord] = useState(false);

  const [autoPlayAudio, setAutoPlayAudio] = useLocalPersistState(
    true,
    "wordscard-auto-audio"
  );

  const [shuffleMode, setShuffleMode] = useLocalPersistState(
    false,
    "wordscard-shuffle"
  );

  // tab-enter restart dialog
  const [openRestart, setOpenRestart] = useState(false);

  const EnterkeyPressReset = (e) => {
    // press enter/or tab to reset;
    if (e.keyCode === 13 || e.keyCode === 9) {
      e.preventDefault();
      setOpenRestart(false);
      setIndex(0);
      setCurrInput("");
      hiddenInputRef.current.value = "";
    } else {
      e.preventDefault();
      setOpenRestart(false);
    }
  };

  const handleTabKeyOpen = () => {
    setOpenRestart(true);
  };

  const word = (alphabetSet) => {
    if(Array.from(alphabetSet).length === 0)
      return "";
    const counts = [3, 4, 5];
    const count = counts[Math.floor(Math.random() * counts.length)];
    let result = "";
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * alphabetSet.size);
      result += Array.from(alphabetSet)[randomIndex];
    }
    return result;
  }

  // localStorage persist theme setting
  const [alphabetSet, setAlphabetSet] = useState(() => {
    const stickyAlphabetSet = window.localStorage.getItem("DictionaryCatalog");
    if (stickyAlphabetSet !== null) {
      const localAlphabetSet = JSON.parse(stickyAlphabetSet);
      const localAlphabetSetList = Object.values(localAlphabetSet)[0];
      return new Set(localAlphabetSetList);
    }
    return new Set();
  });

  const [currInput, setCurrInput] = useState("");

  const [vocabSource, setVocabSource] = useState(() => {
    const stickyAlphabetSet = window.localStorage.getItem("DictionaryCatalog");
    if (stickyAlphabetSet !== null) {
      const localAlphabetSet = JSON.parse(stickyAlphabetSet);
      const localAlphabetSetKey = Object.keys(localAlphabetSet)[0];
      return localAlphabetSetKey;
    }
    return "GRE";
  });

  // local persist vocab mode order
  // const [order, setOrder] = useLocalPersistState("alphabet", "VocabOrder");

  const [index, setIndex] = useLocalPersistState(0, "currIndex");

  const [currChapter, setCurrChapter] = useLocalPersistState(
    "a",
    "currChapter"
  );

  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [wordsDict, setWordsDict] = useState(() => {
    const words = wordsCardVocabGenerator(vocabSource, currChapter);
    return shuffleMode ? shuffleArray(words) : words;
  });

  const hiddenInputRef = useRef();
  useEffect(() => {
    hiddenInputRef.current && hiddenInputRef.current.focus();
  });
  const handleInputBlur = (event) => {
    if (!openRestart) {
      hiddenInputRef.current && hiddenInputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    setCurrInput(e.target.value);
    hiddenInputRef.current.value = e.target.value;
    e.preventDefault();
  };

  const updateAlphabetSet = (char) => {
    const newAlphabetSet = new Set(alphabetSet);
    if (newAlphabetSet.has(char)) {
      newAlphabetSet.delete(char);
    } else {
      newAlphabetSet.add(char);
    }
    const catalogLocalStore = {
      [vocabSource]: [...newAlphabetSet],
    };
    window.localStorage.setItem(
      "DictionaryCatalog",
      JSON.stringify(catalogLocalStore)
    );
    if (newAlphabetSet.size > 0 && !newAlphabetSet.has(currChapter)) {
      setCurrChapter([...newAlphabetSet].sort()[0]);
      setIndex(0);
    }
    setAlphabetSet(newAlphabetSet);
    setSelectiveWord(() => word(newAlphabetSet));
    setCurrInput("");
    hiddenInputRef.current.value = "";
  };

  const updateVocabSource = (source) => {
    const catalogLocalStore = {
      [source]: [...alphabetSet],
    };
    window.localStorage.setItem(
      "DictionaryCatalog",
      JSON.stringify(catalogLocalStore)
    );
    setVocabSource(source);
    setIndex(0);
    setCurrInput("");
    hiddenInputRef.current.value = "";
  };

  const toggleCatalog = () => {
    setShowCatalog(!showCatalog);
  };

  const getCatalogDisplay = () => {
    return (
      showCatalog && (
        <div className="Catalog">
          {Object.keys(DICTIONARY_SOURCE_CATALOG[vocabSource]).map((char) => (
            <div
              key={char}
              className={
                alphabetSet.has(char) ? "Catalog-li-Activated" : "Catalog-li"
              }
              onClick={() => updateAlphabetSet(char)}
            >
              {char.toUpperCase()}
            </div>
          ))}
        </div>
      )
    );
  };

  const getSelectedVocabSourceDisplay = () => {
    return (
      <div className="Catalog-Selected">
        {Object.keys(DICTIONARY_SOURCE_CATALOG).map((optionSource) => (
          <div
            key={optionSource}
            className={
              vocabSource === optionSource
                ? "Catalog-li-Activated"
                : "Catalog-li"
            }
            onClick={() => updateVocabSource(optionSource)}
          >
            {optionSource}
          </div>
        ))}
      </div>
    );
  };

  const getChapterTitle = () => {
    return (
      <div>
        <Tooltip title={t("select_chapters")}>
          <UnfoldMoreIcon></UnfoldMoreIcon>
        </Tooltip>
      </div>
    );
  };

  const getCharDisplay = (idx, char) => {
    if (mode !== "vocab") return char; //fixed hiding in vocab mode only
    if (idx < currInput.length) {
      if (currInput[idx] === char) {
        return char;
      }
      if (hideWord) {
        return currInput[idx];
      }
    }
    if (hideWord) {
      return "_";
    }
    return char;
  };

  const getCharClassName = (idx, char) => {
    if (idx < currInput.length) {
      if (currInput[idx] === char) {
        return "correct-wordcard-char";
      }
      if (char === " ") {
        return "error-wordcard-space-char";
      }
      return "wordcard-error-char";
    }
    return "wordcard-char";
  };

  const currWord = mode === "vocab" ? wordsDict[index].key : selectiveWord;
  const currMeaning = mode === "vocab" ? wordsDict[index].val : "";
  const extra = currInput.slice(currWord.length, currInput.length).split("");
  const currChapterStartIndex =
    DICTIONARY_SOURCE_CATALOG[vocabSource][currChapter][0];
  const currChapterEndIndex =
    DICTIONARY_SOURCE_CATALOG[vocabSource][currChapter][1];
  const currChapterCount = currChapterEndIndex - currChapterStartIndex + 1;

  const start = () => {
    if (status === "finished") {
      return;
      // reset(sentencesCountConstant, language);
    }
    if (status !== "started") {
      setStatus("started");
    }
  };

  useEffect(() => {
    const newChapterWords = wordsCardVocabGenerator(vocabSource, currChapter);
    setWordsDict(shuffleMode ? shuffleArray(newChapterWords) : newChapterWords);
    setCurrInput("");
    hiddenInputRef.current.value = "";
  }, [currChapter, vocabSource, shuffleMode]);

  useEffect(() => {
    if (alphabetSet.size === 0) {
      setCurrChapter("a");
      setIndex(0);
    }
  }, [alphabetSet.size, setCurrChapter, setIndex]);

  useEffect(() => {
    setCurrInput("");
    hiddenInputRef.current.value = "";
  }, [index]);

  const changeChapter = (chapter) => {
    setCurrChapter(chapter);
    setIndex(0);
  };

  const handleKeyDown = (e) => {
    if (soundMode) {
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

    // if enter key pressed.
    // advance to next sentence only if the input val length is equal to the current sentence char count);
    if (currInput.length >= currWord.length) {
      if (keyCode === 13 || keyCode === 32) {
        if (currWord === currInput) {
          if (keyCode === 32) {
            e.preventDefault();
          }
          if (mode === "vocab") {
            const nextIndex = index + 1;
            // to next chapter or back to default
            if (nextIndex === currChapterCount) {
              // setCurrChapter("b");
              if (alphabetSet.size > 1) {
                const currentAlphabetSetList = [...alphabetSet].sort();
                const currPosition = currentAlphabetSetList.indexOf(currChapter);
                if (currPosition === currentAlphabetSetList.length - 1) {
                  setCurrChapter(currentAlphabetSetList[0]);
                } else {
                  setCurrChapter(currentAlphabetSetList[currPosition + 1]);
                }
              }
              setCurrInput("");
              hiddenInputRef.current.value = "";
              setIndex(0);
              return;
            }

            setIndex(nextIndex);
          } else if (mode === "selective") {
            setSelectiveWord(() => word(alphabetSet));
          }
          setCurrInput("");
          hiddenInputRef.current.value = "";
        }
        // if (currSentenceIndex + 1 === sentencesCountConstant) {
        //   // setStatus("finished");
        //   // setTimeRunning(false);
        //   return;
        // }
        // setCurrSentenceIndex(currSentenceIndex + 1);
        // setCurrInput("");
        return;
      }
      return;
    }
  };

  const getChapterClassName = (chapter, currChapter) => {
    if (mode !== "vocab") {
      return "active-button";
    }
    if (chapter === currChapter) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getModeActivation = (type) => {
    // return "active-button" ;
    return mode === type ? "active-button" : "inactive-button"
  }

  const getExtraCharClassName = (char) => {
    if (char === " ") {
      return "wordcard-error-char-space-char";
    }
    return "wordcard-error-char";
  };

  const getEyeIconDisplay = () => {
    if (!hideWord) {
      return (
        <Tooltip title={t("recite_mode")}>
          <RemoveRedEyeIcon></RemoveRedEyeIcon>
        </Tooltip>
      );
    }
    return <VisibilityOffIcon></VisibilityOffIcon>;
  };

  const audioSource =
    "https://dict.youdao.com/dictvoice?audio=" + currWord + "&type=2";

  const playAudio = () => {
    const audio = document.getElementById("hiddenAudio");
    if (audio) {
      audio.load();
      audio.play();
    }
  };

  // Auto-play audio when word changes
  useEffect(() => {
    if (autoPlayAudio && mode === "vocab" && currWord) {
      // Small delay to let the audio source update
      const timer = setTimeout(() => {
        playAudio();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currWord, autoPlayAudio, mode]);
  const getSelected = () => {
    return (
      <div className="Catalog-Selected">
        <div>
          {
            alphabetSet.size === 0 ?
              "Please select keys to practice from selected keys." :
              'Practice from keys: ' + [...alphabetSet].sort().join(", ").toUpperCase()
          }
        </div>
      </div>
    );
  }

  const toggleShuffle = () => {
    setShuffleMode(!shuffleMode);
    setIndex(0);
    setCurrInput("");
    hiddenInputRef.current.value = "";
  };

  const setSelective = () => {
    setHideWord(false);      
    setSelectiveWord(() => word(alphabetSet));
    setMode("selective")
  }

  return (
    <div className="words-card-container">
      <div className="words-card-catalog">
        {(() => {
          switch (mode) {
            case "vocab":
              return getSelectedVocabSourceDisplay();
            default:
              return getSelected();
          }
        })()}
        <div
          className={
            !showCatalog ? "Catalog-Button" : "Catalog-Button-Activated"
          }
          onClick={toggleCatalog}
        >
          <div className="Catalog-title"> {getChapterTitle()}</div>
        </div>
        {getCatalogDisplay()}
      </div>
      <div className="words-card-main">

        <input
          className="hidden-input"
          ref={hiddenInputRef}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          onKeyDown={(e) => handleKeyDown(e)}
          // disabled={mode !== "vocab"}
        ></input>
        <div className="wordcard-meaning-display-field notranslate" translate="no">{currMeaning}</div>
        {
          mode === "vocab" &&
          <>
            <IconButton
              aria-label="play-audio"
              color="secondary"
              size="medium"
              onClick={() => {
                playAudio();
              }}
            >
              <VolumeUpIcon />
            </IconButton>
            <Tooltip title={autoPlayAudio ? t("auto_play_on") : t("auto_play_off")}>
              <IconButton
                aria-label="toggle-auto-play"
                color="secondary"
                size="medium"
                onClick={() => setAutoPlayAudio(!autoPlayAudio)}
              >
                {autoPlayAudio ? (
                  <PauseCircleOutlineIcon />
                ) : (
                  <PlayCircleOutlineIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title={shuffleMode ? t("shuffle_on") : t("shuffle_off")}>
              <IconButton
                aria-label="toggle-shuffle"
                color="secondary"
                size="medium"
                onClick={toggleShuffle}
              >
                <ShuffleIcon style={{ opacity: shuffleMode ? 1 : 0.4 }} />
              </IconButton>
            </Tooltip>
          </>
        }
        <div className="wordcard-word-display-field notranslate" translate="no">
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
          <div>
            <audio
              id="hiddenAudio"
              hidden
              src={audioSource}
              preload="none"
              controls
              controlsList="nodownload nofullscreen noremoteplayback"
            />
          </div>
          {
            mode === "vocab" &&
            <div className="wordscard-UI-info">
              {"Chapter  " + currChapter.toUpperCase() + ": "} {index + 1} /{" "}
              {currChapterCount}
            </div>
          }
          {
            mode === "selective" &&
            <p>Selected Keys:</p>
          }

          <div className="restart-button" key="restart-button">
            <Grid container justifyContent="center" alignItems="center">
              {
                mode === "vocab" &&
                <Box display="flex" flexDirection="row">
                  <IconButton
                    aria-label="restart"
                    color="secondary"
                    size="medium"
                    onClick={() => {
                      setIndex(index - 1 >= 0 ? index - 1 : currChapterCount - 1);
                    }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  <IconButton
                    aria-label="restart"
                    color="secondary"
                    size="medium"
                    onClick={() => {
                      setIndex(0);
                    }}
                  >
                    <Tooltip title={t("restart_tooltip_wordscard")}>
                      <RestartAltIcon />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    aria-label="restart"
                    color="secondary"
                    size="medium"
                    onClick={() => {
                      setIndex(index + 1 >= currChapterCount ? 0 : index + 1);
                    }}
                  >
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Box>
              }
              <Box display="flex" flexDirection="row">
                {[...alphabetSet].sort().map((chapter) => (
                  <IconButton
                    key={chapter}
                    onClick={() => {
                      changeChapter(chapter);
                    }}
                  >
                    <span className={getChapterClassName(chapter, currChapter)}>
                      {chapter.toUpperCase()}
                    </span>
                  </IconButton>
                ))}
              </Box>
              {
                mode === "vocab" &&
                <Box display="flex" flexDirection="row">
                  <IconButton
                    onClick={() => {
                      setHideWord(!hideWord);
                    }}
                  >
                    {getEyeIconDisplay()}
                  </IconButton>
                </Box>
              }
            </Grid>
            <Box display="flex" flexDirection="row">
              <IconButton onClick={() => setMode("vocab")}>
                <Tooltip title={t("vocab_mode_tooltip")}>
                  <span className={getModeActivation("vocab")}>Vocab</span>
                </Tooltip>
              </IconButton>
              <IconButton onClick={setSelective}>
                <Tooltip title={t("selective_mode_tooltip")}>
                  <span className={getModeActivation("selective")}>Selective</span>
                </Tooltip>
              </IconButton>
            </Box>
          </div>
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
            <span className="key-type">Tab</span>{" "}
            <span className="key-note">/</span>{" "}
            <span className="key-type">Enter</span>{" "}
            <span className="key-note">to restart the chapter</span>
          </div>
          <span className="key-note"> press </span>
          <span className="key-type">any key </span>{" "}
          <span className="key-note">to exit</span>
        </DialogTitle>
      </Dialog>
    </div>
  );
};

export default WordsCard;
