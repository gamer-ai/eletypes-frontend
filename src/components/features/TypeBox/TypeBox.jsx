import React, { useEffect, useState, useMemo, useRef } from "react";
import useSound from "use-sound";
import {
  wordsGenerator,
  chineseWordsGenerator,
} from "../../../scripts/wordsGenerator";
import { customWordsGenerator } from "../../../scripts/customWords";
import { createRng, generateSeed } from "../../../scripts/seedUtils";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import UndoIcon from "@mui/icons-material/Undo";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import IconButton from "../../utils/IconButton";
import LeaderboardModal from "../Leaderboard/LeaderboardModal";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SettingsIcon from "@mui/icons-material/Settings";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import useLocalPersistState from "../../../hooks/useLocalPersistState";
import CapsLockSnackbar from "../CapsLockSnackbar";
import Stats from "./Stats";
import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import {
  DEFAULT_COUNT_DOWN,
  COUNT_DOWN_90,
  COUNT_DOWN_60,
  COUNT_DOWN_30,
  COUNT_DOWN_15,
  COUNT_DOWN_INFINITE,
  DEFAULT_WORDS_COUNT,
  DEFAULT_DIFFICULTY,
  HARD_DIFFICULTY,
  NUMBER_ADDON,
  SYMBOL_ADDON,
  ENGLISH_MODE,
  CHINESE_MODE,
  PACING_CARET,
  PACING_PULSE,
  NUMBER_ADDON_KEY,
  SYMBOL_ADDON_KEY,
} from "../../../constants/Constants";
import { SOUND_MAP } from "../sound/sound";
import SocialLinksModal from "../../common/SocialLinksModal";
import EnglishModeWords from "../../common/EnglishModeWords";
import ChineseModeWords from "../../common/ChineseModeWords";
import { useLocale } from "../../../context/LocaleContext";

const TypeBox = ({
  textInputRef,
  isFocusedMode,
  isUltraZenMode,
  soundMode,
  soundType,
  handleInputFocus,
  theme,
  sessionSeed,
  setSessionSeed,
  customWordsOverride,
  onClearCustomWords,
  toggleUltraZenMode,
  onCreateWordList,
  hasActiveWordList,
  customWordLists,
  activeWordListId,
  onActivateWordList,
}) => {
  const { t } = useLocale();
  const [play] = useSound(SOUND_MAP[soundType], { volume: 0.5 });
  const [incorrectCharsCount, setIncorrectCharsCount] = useState(0);

  // local persist timer
  const [countDownConstant, setCountDownConstant] = useLocalPersistState(
    DEFAULT_COUNT_DOWN,
    "timer-constant"
  );

  // local persist pacing style
  const [pacingStyle, setPacingStyle] = useLocalPersistState(
    PACING_PULSE,
    "pacing-style"
  );

  // Chinese-mode display toggle: "both" | "hanzi" | "pinyin". Controls
  // whether the Chinese characters and/or the pinyin hint are visible.
  const [chineseDisplayMode, setChineseDisplayMode] = useLocalPersistState(
    "both",
    "chinese-display-mode"
  );

  // local persist difficulty
  const [difficulty, setDifficulty] = useLocalPersistState(
    DEFAULT_DIFFICULTY,
    "difficulty"
  );

  // local persist language
  const [language, setLanguage] = useLocalPersistState(
    ENGLISH_MODE,
    "language"
  );

  // local persist words add on for number
  const [numberAddOn, setNumberAddOn] = useLocalPersistState(
    false,
    NUMBER_ADDON_KEY
  );

  // local persist words add on for symbol
  const [symbolAddOn, setSymbolAddOn] = useLocalPersistState(
    false,
    SYMBOL_ADDON_KEY
  );

  // Caps Lock
  const [capsLocked, setCapsLocked] = useState(false);

  // tab-enter restart dialog
  const [openRestart, setOpenRestart] = useState(false);

  // Leaderboard modal moved out of FooterMenu — its trigger lives in the
  // quick-tools strip above the type box now (more discoverable).
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  // Anchor for the custom-words quick-pick menu. Clicking the toolbar's
  // "custom words" icon opens a menu listing saved lists for one-click
  // activation, plus shortcuts to create / clear. Beats forcing the user to
  // dig through Profile → Word Lists every time.
  const [wordListMenuAnchor, setWordListMenuAnchor] = useState(null);
  const wordListMenuOpen = Boolean(wordListMenuAnchor);
  const openWordListMenu = (e) => setWordListMenuAnchor(e.currentTarget);
  const closeWordListMenu = () => setWordListMenuAnchor(null);

  const EnterkeyPressReset = (e) => {
    // press enter/or tab to reset;
    if (e.keyCode === 13 || e.keyCode === 9) {
      e.preventDefault();
      setOpenRestart(false);
      reset(
        countDownConstant,
        difficulty,
        language,
        numberAddOn,
        symbolAddOn,
        false
      );
    } // press space to redo
    else if (e.keyCode === 32) {
      e.preventDefault();
      setOpenRestart(false);
      reset(
        countDownConstant,
        difficulty,
        language,
        numberAddOn,
        symbolAddOn,
        true
      );
    } else {
      e.preventDefault();
      setOpenRestart(false);
    }
  };
  const handleTabKeyOpen = () => {
    setOpenRestart(true);
  };

  // When a custom word list is active, it preempts the persisted language
  // setting for this test. The list's own language drives both word generation
  // and rendering. Built-in difficulty/number/symbol add-ons are skipped — the
  // user already curated the exact words they want.
  const effectiveLanguage = customWordsOverride?.language ?? language;

  // set up words state
  const [wordsDict, setWordsDict] = useState(() => {
    const rng = sessionSeed ? createRng(sessionSeed) : undefined;
    if (customWordsOverride?.parsed?.length) {
      return customWordsGenerator(
        customWordsOverride.parsed,
        DEFAULT_WORDS_COUNT,
        rng
      );
    }
    if (effectiveLanguage === ENGLISH_MODE) {
      return wordsGenerator(
        DEFAULT_WORDS_COUNT,
        difficulty,
        ENGLISH_MODE,
        numberAddOn,
        symbolAddOn,
        rng
      );
    }
    if (effectiveLanguage === CHINESE_MODE) {
      return chineseWordsGenerator(
        difficulty,
        CHINESE_MODE,
        numberAddOn,
        symbolAddOn,
        rng
      );
    }
  });

  const words = useMemo(() => {
    return wordsDict.map((e) => e.val);
  }, [wordsDict]);

  const wordsKey = useMemo(() => {
    return wordsDict.map((e) => e.key);
  }, [wordsDict]);

  const wordSpanRefs = useMemo(
    () =>
      Array(words.length)
        .fill(0)
        .map((i) => React.createRef()),
    [words]
  );

  // set up timer state
  const [countDown, setCountDown] = useState(countDownConstant);
  const [intervalId, setIntervalId] = useState(null);
  // Infinite mode has no countdown; track elapsed seconds for WPM math
  // and chart sampling instead.
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const isInfiniteMode = countDownConstant === COUNT_DOWN_INFINITE;

  // set up game loop status state
  const [status, setStatus] = useState("waiting");

  // enable menu
  const menuEnabled = !isFocusedMode || status === "finished";

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

  // setup stats
  const [rawKeyStrokes, setRawKeyStrokes] = useState(0);
  const [wpmKeyStrokes, setWpmKeyStrokes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [statsCharCount, setStatsCharCount] = useState([]);

  // set up char examine hisotry
  const [history, setHistory] = useState({});
  const keyString = currWordIndex + "." + currCharIndex;
  const [currChar, setCurrChar] = useState("");

  useEffect(() => {
    if (currWordIndex === DEFAULT_WORDS_COUNT - 1) {
      if (customWordsOverride?.parsed?.length) {
        const generatedCustom = customWordsGenerator(
          customWordsOverride.parsed,
          DEFAULT_WORDS_COUNT
        );
        setWordsDict((currentArray) => [...currentArray, ...generatedCustom]);
      } else if (effectiveLanguage === ENGLISH_MODE) {
        const generatedEng = wordsGenerator(
          DEFAULT_WORDS_COUNT,
          difficulty,
          ENGLISH_MODE,
          numberAddOn,
          symbolAddOn
        );
        setWordsDict((currentArray) => [...currentArray, ...generatedEng]);
      } else if (effectiveLanguage === CHINESE_MODE) {
        const generatedChinese = chineseWordsGenerator(
          difficulty,
          CHINESE_MODE,
          numberAddOn,
          symbolAddOn
        );
        setWordsDict((currentArray) => [...currentArray, ...generatedChinese]);
      }
    }
    if (wordSpanRefs[currWordIndex]) {
      const scrollElement = wordSpanRefs[currWordIndex].current;
      if (scrollElement) {
        // Find the type-box container (overflow:hidden parent)
        const typeBox = scrollElement.closest(".type-box") || scrollElement.closest(".type-box-chinese");
        if (typeBox) {
          // Calculate the row height from the word element
          const wordWrapper = effectiveLanguage === CHINESE_MODE
            ? scrollElement.parentElement // div wrapping pinyin + chars
            : scrollElement;
          const rowHeight = wordWrapper ? wordWrapper.offsetHeight +
            parseFloat(getComputedStyle(wordWrapper).marginBottom || 0) : 0;

          if (rowHeight > 0) {
            // Align scroll to row boundary — show current word on second row
            const wordTop = wordWrapper.offsetTop;
            const targetScroll = Math.max(0, wordTop - rowHeight);
            typeBox.scrollTop = targetScroll;
          } else {
            scrollElement.scrollIntoView({ block: "center" });
          }
        } else {
          scrollElement.scrollIntoView({ block: "center" });
        }
      }
    } else {
      return;
    }
  }, [
    currWordIndex,
    wordSpanRefs,
    difficulty,
    language,
    effectiveLanguage,
    numberAddOn,
    symbolAddOn,
    customWordsOverride,
  ]);

  const reset = (
    newCountDown,
    difficulty,
    language,
    newNumberAddOn,
    newSymbolAddOn,
    isRedo
  ) => {
    setStatus("waiting");
    if (!isRedo) {
      const newSeed = generateSeed();
      setSessionSeed(newSeed);
      const rng = createRng(newSeed);
      // Custom list locks the language for this test — see effectiveLanguage.
      const resetLanguage = customWordsOverride?.language ?? language;
      if (customWordsOverride?.parsed?.length) {
        setWordsDict(
          customWordsGenerator(
            customWordsOverride.parsed,
            DEFAULT_WORDS_COUNT,
            rng
          )
        );
      } else if (resetLanguage === CHINESE_MODE) {
        setWordsDict(
          chineseWordsGenerator(
            difficulty,
            resetLanguage,
            newNumberAddOn,
            newSymbolAddOn,
            rng
          )
        );
      } else if (resetLanguage === ENGLISH_MODE) {
        setWordsDict(
          wordsGenerator(
            DEFAULT_WORDS_COUNT,
            difficulty,
            resetLanguage,
            newNumberAddOn,
            newSymbolAddOn,
            rng
          )
        );
      }
    }
    setNumberAddOn(newNumberAddOn);
    setSymbolAddOn(newSymbolAddOn);
    setCountDownConstant(newCountDown);
    setCountDown(newCountDown);
    setDifficulty(difficulty);
    setLanguage(language);
    clearInterval(intervalId);
    setWpm(0);
    setRawKeyStrokes(0);
    setWpmKeyStrokes(0);
    setElapsedSeconds(0);
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
  };

  const start = () => {
    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
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
      let intervalId;
      if (isInfiniteMode) {
        // Untimed practice: count up instead of down, never finish.
        intervalId = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        intervalId = setInterval(() => {
          setCountDown((prevCountdown) => {
            if (prevCountdown === 0) {
              clearInterval(intervalId);
              // current total extra inputs char count
              const currCharExtraCount = Object.values(history)
                .filter((e) => typeof e === "number")
                .reduce((a, b) => a + b, 0);

              // current correct inputs char count
              const currCharCorrectCount = Object.values(history).filter(
                (e) => e === true
              ).length;

              // current correct inputs char count
              const currCharIncorrectCount = Object.values(history).filter(
                (e) => e === false
              ).length;

              // current missing inputs char count
              const currCharMissingCount = Object.values(history).filter(
                (e) => e === undefined
              ).length;

              // current total advanced char counts
              const currCharAdvancedCount =
                currCharCorrectCount +
                currCharMissingCount +
                currCharIncorrectCount;

              // When total inputs char count is 0,
              // that is to say, both currCharCorrectCount and currCharAdvancedCount are 0,
              // accuracy turns out to be 0 but NaN.
              const accuracy =
                currCharCorrectCount === 0
                  ? 0
                  : (currCharCorrectCount / currCharAdvancedCount) * 100;

              setStatsCharCount([
                accuracy,
                currCharCorrectCount,
                currCharIncorrectCount,
                currCharMissingCount,
                currCharAdvancedCount,
                currCharExtraCount,
              ]);

              checkPrev();
              setStatus("finished");

              return countDownConstant;
            } else {
              return prevCountdown - 1;
            }
          });
        }, 1000);
      }
      setIntervalId(intervalId);
    }
  };

  const UpdateInput = (e) => {
    if (status === "finished") {
      return;
    }
    setCurrInput(e.target.value);
    inputWordsHistory[currWordIndex] = e.target.value.trim();
    setInputWordsHistory(inputWordsHistory);
  };

  const handleKeyUp = (e) => {
    setCapsLocked(e.getModifierState("CapsLock"));
  };

  const wpmWorkerRef = useRef(null);

  useEffect(() => {
    // Initialize worker
    wpmWorkerRef.current = new Worker(
      new URL("../../../worker/calculateWpmWorker", import.meta.url)
    );

    return () => {
      // Cleanup worker on component unmount
      if (wpmWorkerRef.current) {
        wpmWorkerRef.current.terminate();
      }
    };
  }, []);

  const calculateWpm = (wpmKeyStrokes, countDownConstant, countDown) => {
    if (wpmKeyStrokes !== 0) {
      if (!wpmWorkerRef.current) return; // Ensure worker is initialized

      wpmWorkerRef.current.postMessage({
        wpmKeyStrokes,
        countDownConstant,
        countDown,
      });

      wpmWorkerRef.current.onmessage = (event) => {
        setWpm(event.data);
      };

      wpmWorkerRef.current.onerror = (error) => {
        console.error("Worker error:", error);
      };
    }
  };

  const handleKeyDown = (e) => {
    if (status !== "finished" && soundMode) {
      play();
    }
    const key = e.key;
    const keyCode = e.keyCode;
    setCapsLocked(e.getModifierState("CapsLock"));

    // keydown count for KPM calculations to all types of operations
    if (status === "started") {
      setRawKeyStrokes(rawKeyStrokes + 1);
      // Count every printable single-character keystroke toward WPM, not
      // just A-Z. Older versions limited this to keyCode 65–90 and silently
      // under-counted digits and symbols in +number / +symbol modes.
      // Space is intentionally excluded here — it's credited separately in
      // checkPrev() only when the previous word completed correctly, so the
      // user doesn't get a stroke for skipping a word with the spacebar.
      // Modifier-held keystrokes (Ctrl+A, Cmd+C, etc.) are not real char
      // input and would otherwise be miscounted.
      if (
        key &&
        key.length === 1 &&
        key !== " " &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        setWpmKeyStrokes(wpmKeyStrokes + 1);
      }
    }

    // disable Caps Lock key
    if (keyCode === 20) {
      e.preventDefault();
      return;
    }

    // disable shift alt ctrl
    if (keyCode >= 16 && keyCode <= 18) {
      e.preventDefault();
      return;
    }

    // disable tab key
    if (keyCode === 9) {
      e.preventDefault();
      handleTabKeyOpen();
      return;
    }

    if (status === "finished") {
      setCurrInput("");
      setPrevInput("");
      return;
    }

    // Update stats when typing unless there is no effective WPM
    if (wpmKeyStrokes !== 0) {
      // In infinite mode countDown never decrements, so translate the
      // elapsed-time counter into the equivalent remaining-countdown value
      // the WPM worker expects (elapsed = countDownConstant - countDown + 1).
      const effectiveCountDown = isInfiniteMode
        ? countDownConstant - elapsedSeconds
        : countDown;
      calculateWpm(wpmKeyStrokes, countDownConstant, effectiveCountDown);
    }

    // start the game by typing any thing
    if (status !== "started" && status !== "finished") {
      start();
    }

    // space bar
    if (keyCode === 32) {
      const prevCorrectness = checkPrev();
      // advance to next regardless prev correct/not
      if (prevCorrectness === true || prevCorrectness === false) {
        if (
          words[currWordIndex].split("").length > currInput.split("").length
        ) {
          setIncorrectCharsCount((prev) => prev + 1);
        }

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
      // Anti-cheat: backspacing a printable char undoes the stroke we
      // credited when it was typed. Without this, the "mash N keys →
      // backspace all → type real words" pattern leaves wpmKeyStrokes
      // inflated by N and yields WPM ≈ 300+ on a 60s test. Mirrors the
      // increment rule above: any printable ASCII char except space
      // refunds one stroke on deletion (space is only credited via
      // checkPrev() on correct word completion, not here). The input is
      // opacity:0 so selection-delete and Ctrl+Backspace word-delete have
      // no visual affordance to be used as cheat vectors here, so a
      // simple one-char-per-keydown decrement is sufficient.
      if (status === "started") {
        const inputValue = e.target.value || "";
        const deletingChar = inputValue[inputValue.length - 1];
        if (deletingChar && /^[\x21-\x7e]$/.test(deletingChar)) {
          setWpmKeyStrokes((prev) => Math.max(0, prev - 1));
        }
      }
      return;
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
      return;
      // if (keyCode >= 65 && keyCode <= 90) {
      //   setCurrCharIndex(currCharIndex + 1);
      //   setCurrChar(key);
      // } else {
      //   return;
      // }
    }
  };

  const getExtraCharClassName = () => {
    return "error-char";
  };

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
      const extra = input.slice(word.length, input.length).split("");
      history[i] = extra.length;
      return extra.map((c, idx) => (
        <span key={idx} className={getExtraCharClassName(i, idx, extra)}>
          {c}
        </span>
      ));
    }
  };

  const checkPrev = () => {
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

      // here count the space as effective wpm.
      setWpmKeyStrokes(wpmKeyStrokes + 1);
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
  };

  const getWordClassName = (wordIdx) => {
    if (wordsInCorrect.has(wordIdx)) {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "word error-word active-word";
        } else {
          return "word error-word active-word-no-pulse";
        }
      }
      return "word error-word";
    } else {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "word active-word";
        } else {
          return "word active-word-no-pulse";
        }
      }
      return "word";
    }
  };

  const getChineseWordKeyClassName = (wordIdx) => {
    if (wordsInCorrect.has(wordIdx)) {
      if (currWordIndex === wordIdx) {
        return "chinese-word-key error-chinese active-chinese";
      }
      return "chinese-word-key error-chinese";
    } else {
      if (currWordIndex === wordIdx) {
        return "chinese-word-key active-chinese";
      }
      return "chinese-word-key";
    }
  };

  const getChineseWordClassName = (wordIdx) => {
    if (wordsInCorrect.has(wordIdx)) {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "chinese-word error-word active-word";
        } else {
          return "chinese-word error-word active-word-no-pulse";
        }
      }
      return "chinese-word error-word";
    } else {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          return "chinese-word active-word";
        } else {
          return "chinese-word active-word-no-pulse";
        }
      }
      return "chinese-word";
    }
  };

  const charsWorkerRef = useRef();

  useEffect(() => {
    charsWorkerRef.current = new Worker(
      new URL("../../../worker/trackCharsErrorsWorker", import.meta.url)
    );

    charsWorkerRef.current.onmessage = (e) => {
      if (e.data.type === "increment") {
        setIncorrectCharsCount((prev) => prev + 1);
      }
    };

    return () => {
      charsWorkerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    if (status !== "started") return;

    const word = words[currWordIndex];

    charsWorkerRef.current.postMessage({
      word,
      currChar,
      currCharIndex,
    });
  }, [currChar, status, currCharIndex, words, currWordIndex]);

  const getCharClassName = (wordIdx, charIdx, char, word) => {
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
    } else {
      if (wordIdx < currWordIndex) {
        // missing chars
        history[keyString] = undefined;
      }

      return "char";
    }
  };

  const getDifficultyButtonClassName = (buttonDifficulty) => {
    if (difficulty === buttonDifficulty) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getAddOnButtonClassName = (addon) => {
    if (addon) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getPacingStyleButtonClassName = (buttonPacingStyle) => {
    if (pacingStyle === buttonPacingStyle) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getTimerButtonClassName = (buttonTimerCountDown) => {
    if (countDownConstant === buttonTimerCountDown) {
      return "active-button";
    }
    return "inactive-button";
  };

  const getLanguageButtonClassName = (buttonLanguage) => {
    if (effectiveLanguage === buttonLanguage) {
      return "active-button";
    }
    return "inactive-button";
  };

  const renderResetButton = () => {
    return (
      <div className="restart-button" key="restart-button">
        <Grid container justifyContent="center" alignItems="center">
          <Box display="flex" flexDirection="row">
            <IconButton
              aria-label="redo"
              color="secondary"
              size="medium"
              onClick={() => {
                reset(
                  countDownConstant,
                  difficulty,
                  language,
                  numberAddOn,
                  symbolAddOn,
                  true
                );
              }}
            >
              <Tooltip title={t("redo_tooltip")}>
                <UndoIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              aria-label="restart"
              color="secondary"
              size="medium"
              onClick={() => {
                reset(
                  countDownConstant,
                  difficulty,
                  language,
                  numberAddOn,
                  symbolAddOn,
                  false
                );
              }}
            >
              <Tooltip title={t("restart_tooltip")}>
                <RestartAltIcon />
              </Tooltip>
            </IconButton>
            {menuEnabled && (
              <>
                <IconButton
                  onClick={() => {
                    reset(
                      COUNT_DOWN_90,
                      difficulty,
                      language,
                      numberAddOn,
                      symbolAddOn,
                      false
                    );
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_90)}>
                    {COUNT_DOWN_90}
                  </span>
                </IconButton>
                <IconButton
                  onClick={() => {
                    reset(
                      COUNT_DOWN_60,
                      difficulty,
                      language,
                      numberAddOn,
                      symbolAddOn,
                      false
                    );
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_60)}>
                    {COUNT_DOWN_60}
                  </span>
                </IconButton>
                <IconButton
                  onClick={() => {
                    reset(
                      COUNT_DOWN_30,
                      difficulty,
                      language,
                      numberAddOn,
                      symbolAddOn,
                      false
                    );
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_30)}>
                    {COUNT_DOWN_30}
                  </span>
                </IconButton>
                <IconButton
                  onClick={() => {
                    reset(
                      COUNT_DOWN_15,
                      difficulty,
                      language,
                      numberAddOn,
                      symbolAddOn,
                      false
                    );
                  }}
                >
                  <span className={getTimerButtonClassName(COUNT_DOWN_15)}>
                    {COUNT_DOWN_15}
                  </span>
                </IconButton>
                <IconButton
                  onClick={() => {
                    reset(
                      COUNT_DOWN_INFINITE,
                      difficulty,
                      language,
                      numberAddOn,
                      symbolAddOn,
                      false
                    );
                  }}
                >
                  {/* Center the icon inside the span: MUI SvgIcon is
                      inline-block and baseline-aligned by default, which
                      would push the infinity symbol above the number labels
                      of the sibling timer buttons. */}
                  <span
                    className={getTimerButtonClassName(COUNT_DOWN_INFINITE)}
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <AllInclusiveIcon sx={{ fontSize: 18 }} />
                  </span>
                </IconButton>
              </>
            )}
          </Box>
          {menuEnabled && (
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              sx={{ "& .MuiIconButton-root": { padding: "6px" } }}
            >
              {/* Word-source mode buttons: Random ⇄ Custom. Behave like a
                  two-way toggle — the active one is highlighted, the other
                  is clickable to switch. Sub-options for the active mode
                  (normal/hard for random; just the list name for custom)
                  appear after the | separator. */}
              <IconButton
                onClick={() => {
                  // No-op if already random; otherwise exit custom mode.
                  if (hasActiveWordList && onClearCustomWords) onClearCustomWords();
                }}
              >
                <Tooltip title={t("word_source_random_tooltip")}>
                  <span
                    className={!hasActiveWordList ? "active-button" : "inactive-button"}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}
                  >
                    <ShuffleIcon sx={{ fontSize: 16 }} />
                    {t("word_source_random_label")}
                  </span>
                </Tooltip>
              </IconButton>
              {onCreateWordList && (
                <IconButton onClick={openWordListMenu}>
                  <Tooltip
                    title={
                      hasActiveWordList
                        ? t("custom_words_active_clear_tooltip", customWordsOverride?.listName || "")
                        : t("custom_words_create_tooltip")
                    }
                  >
                    <span
                      className={hasActiveWordList ? "active-button" : "inactive-button"}
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}
                    >
                      <FormatListBulletedIcon sx={{ fontSize: 16 }} />
                      {hasActiveWordList && customWordsOverride?.listName
                        ? customWordsOverride.listName
                        : t("custom_words_button_label")}
                    </span>
                  </Tooltip>
                </IconButton>
              )}
              {!hasActiveWordList && (
                <>
                  <span
                    className="menu-separator"
                    style={{
                      margin: "0 8px",
                      opacity: 0.45,
                      fontSize: 13,
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    |
                  </span>
                  <IconButton
                    onClick={() => {
                      reset(
                        countDownConstant,
                        DEFAULT_DIFFICULTY,
                        language,
                        numberAddOn,
                        symbolAddOn,
                        false
                      );
                    }}
                  >
                    <Tooltip
                      title={
                        language === ENGLISH_MODE
                          ? t("default_difficulty_tooltip")
                          : t("default_difficulty_tooltip_chinese")
                      }
                    >
                      <span className={getDifficultyButtonClassName(DEFAULT_DIFFICULTY)}>
                        {DEFAULT_DIFFICULTY}
                      </span>
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      reset(
                        countDownConstant,
                        HARD_DIFFICULTY,
                        language,
                        numberAddOn,
                        symbolAddOn,
                        false
                      );
                    }}
                  >
                    <Tooltip
                      title={
                        language === ENGLISH_MODE
                          ? t("hard_difficulty_tooltip")
                          : t("hard_difficulty_tooltip_chinese")
                      }
                    >
                      <span className={getDifficultyButtonClassName(HARD_DIFFICULTY)}>
                        {HARD_DIFFICULTY}
                      </span>
                    </Tooltip>
                  </IconButton>
                  <span
                    className="menu-separator"
                    style={{
                      margin: "0 8px",
                      opacity: 0.45,
                      fontSize: 13,
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    |
                  </span>
                  <IconButton
                    onClick={() => {
                      reset(
                        countDownConstant,
                        difficulty,
                        language,
                        !numberAddOn,
                        symbolAddOn,
                        false
                      );
                    }}
                  >
                    <Tooltip title={t("number_addon_tooltip")}>
                      <span className={getAddOnButtonClassName(numberAddOn)}>
                        {NUMBER_ADDON}
                      </span>
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      reset(
                        countDownConstant,
                        difficulty,
                        language,
                        numberAddOn,
                        !symbolAddOn,
                        false
                      );
                    }}
                  >
                    <Tooltip title={t("symbol_addon_tooltip")}>
                      <span className={getAddOnButtonClassName(symbolAddOn)}>
                        {SYMBOL_ADDON}
                      </span>
                    </Tooltip>
                  </IconButton>
                  <span
                    className="menu-separator"
                    style={{
                      margin: "0 8px",
                      opacity: 0.45,
                      fontSize: 13,
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    |
                  </span>
                  <IconButton
                    onClick={() => {
                      reset(
                        countDownConstant,
                        difficulty,
                        ENGLISH_MODE,
                        numberAddOn,
                        symbolAddOn,
                        false
                      );
                    }}
                  >
                    <Tooltip title={t("english_mode_tooltip")}>
                      <span className={getLanguageButtonClassName(ENGLISH_MODE)}>
                        eng
                      </span>
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      reset(
                        countDownConstant,
                        difficulty,
                        CHINESE_MODE,
                        numberAddOn,
                        symbolAddOn,
                        false
                      );
                    }}
                  >
                    <Tooltip title={t("chinese_mode_tooltip")}>
                      <span className={getLanguageButtonClassName(CHINESE_MODE)}>
                        chn
                      </span>
                    </Tooltip>
                  </IconButton>
                </>
              )}
              <span
                className="menu-separator"
                style={{
                  margin: "0 6px",
                  opacity: 0.45,
                  fontSize: 13,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                |
              </span>
              <IconButton
                onClick={() => {
                  setPacingStyle(PACING_PULSE);
                }}
              >
                <Tooltip title={t("pacing_pulse_tooltip")}>
                  <span className={getPacingStyleButtonClassName(PACING_PULSE)}>
                    {PACING_PULSE}
                  </span>
                </Tooltip>
              </IconButton>
              <IconButton
                onClick={() => {
                  setPacingStyle(PACING_CARET);
                }}
              >
                <Tooltip title={t("pacing_caret_tooltip")}>
                  <span className={getPacingStyleButtonClassName(PACING_CARET)}>
                    {PACING_CARET}
                  </span>
                </Tooltip>
              </IconButton>
              <span
                className="menu-separator"
                style={{
                  margin: "0 6px",
                  opacity: 0.45,
                  fontSize: 13,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                |
              </span>
              {toggleUltraZenMode && (
                <IconButton onClick={toggleUltraZenMode}>
                  <Tooltip title={t("ultra_zen_mode")}>
                    <span
                      className={isUltraZenMode ? "active-button" : "inactive-button"}
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <ZoomInMapIcon sx={{ fontSize: 16 }} />
                    </span>
                  </Tooltip>
                </IconButton>
              )}
              {effectiveLanguage === CHINESE_MODE && (
                <IconButton
                  onClick={() => {
                    setChineseDisplayMode((prev) =>
                      prev === "both"
                        ? "hanzi"
                        : prev === "hanzi"
                        ? "pinyin"
                        : "both"
                    );
                  }}
                >
                  <Tooltip title={t("chinese_display_mode_tooltip")}>
                    <span
                      className="active-button"
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      {chineseDisplayMode === "both"
                        ? "双"
                        : chineseDisplayMode === "hanzi"
                        ? "字"
                        : "pin"}
                    </span>
                  </Tooltip>
                </IconButton>
              )}
              <IconButton onClick={() => setLeaderboardOpen(true)}>
                <Tooltip title={t("stats_tooltip")}>
                  <span
                    className="inactive-button"
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <LeaderboardIcon sx={{ fontSize: 16 }} />
                  </span>
                </Tooltip>
              </IconButton>
            </Box>
          )}
        </Grid>
      </div>
    );
  };

  const baseChunkSize = 120;
  const [startIndex, setStartIndex] = useState(0);
  const [visibleWordsCount, setVisibleWordsCount] = useState(baseChunkSize);

  // Reset startIndex when status changes
  useEffect(() => {
    setStartIndex(0);
  }, [status]);

  // Adjust visible words based on current word index
  useEffect(() => {
    const endIndex = startIndex + visibleWordsCount;

    // Ensure the current word is within the visible area
    if (currWordIndex >= endIndex - 5) {
      const newStartIndex = Math.max(
        0,
        Math.min(
          currWordIndex - Math.floor(visibleWordsCount / 2),
          words.length - visibleWordsCount
        )
      );

      if (newStartIndex !== startIndex) {
        setStartIndex(newStartIndex);
        setVisibleWordsCount(
          Math.min(words.length - newStartIndex, baseChunkSize)
        );
      }
    }
  }, [currWordIndex, startIndex, words.length, visibleWordsCount]);

  // Calculate the end index and slice the words
  const endIndex = useMemo(
    () => Math.min(startIndex + visibleWordsCount, words.length),
    [startIndex, visibleWordsCount, words.length]
  );

  const currentWords = useMemo(
    () => words.slice(startIndex, endIndex),
    [startIndex, endIndex, words]
  );

  return (
    <>
      {/* <SocialLinksModal status={status} /> */}
      <div onClick={handleInputFocus}>
        <CapsLockSnackbar open={capsLocked}></CapsLockSnackbar>
        {effectiveLanguage === ENGLISH_MODE && (
          <EnglishModeWords
            currentWords={currentWords}
            currWordIndex={currWordIndex}
            currCharIndex={currCharIndex}
            isUltraZenMode={isUltraZenMode}
            startIndex={startIndex}
            status={status}
            wordSpanRefs={wordSpanRefs}
            getWordClassName={getWordClassName}
            getCharClassName={getCharClassName}
            getExtraCharsDisplay={getExtraCharsDisplay}
            pacingStyle={pacingStyle}
            theme={theme}
          />
        )}
        {effectiveLanguage === CHINESE_MODE && (
          <ChineseModeWords
            currentWords={currentWords}
            currWordIndex={currWordIndex}
            currCharIndex={currCharIndex}
            wordsKey={wordsKey}
            chineseDisplayMode={chineseDisplayMode}
            isUltraZenMode={isUltraZenMode}
            status={status}
            wordSpanRefs={wordSpanRefs}
            startIndex={startIndex}
            getChineseWordKeyClassName={getChineseWordKeyClassName}
            getChineseWordClassName={getChineseWordClassName}
            getCharClassName={getCharClassName}
            getExtraCharsDisplay={getExtraCharsDisplay}
            pacingStyle={pacingStyle}
            theme={theme}
          />
        )}
        <div className="stats">
          <Stats
            status={status}
            language={language}
            wpm={wpm}
            setIncorrectCharsCount={setIncorrectCharsCount}
            incorrectCharsCount={incorrectCharsCount}
            theme={theme}
            countDown={countDown}
            countDownConstant={countDownConstant}
            isInfiniteMode={isInfiniteMode}
            elapsedSeconds={elapsedSeconds}
            statsCharCount={statsCharCount}
            rawKeyStrokes={rawKeyStrokes}
            wpmKeyStrokes={wpmKeyStrokes}
            renderResetButton={renderResetButton}
            difficulty={difficulty}
            numberAddon={numberAddOn}
            symbolAddon={symbolAddOn}
            sessionSeed={sessionSeed}
            isCustomMode={!!customWordsOverride}
            customListName={customWordsOverride?.listName}
          ></Stats>
          {status !== "finished" && renderResetButton()}
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
              <span className="key-note"> {t("press")} </span>
              <span className="key-type">Space</span>{" "}
              <span className="key-note">{t("to_redo")}</span>
            </div>
            <div>
              <span className="key-note"> {t("press")} </span>
              <span className="key-type">Tab</span>{" "}
              <span className="key-note">/</span>{" "}
              <span className="key-type">Enter</span>{" "}
              <span className="key-note">{t("to_restart")}</span>
            </div>
            <span className="key-note"> {t("press")} </span>
            <span className="key-type">{t("any_key")} </span>{" "}
            <span className="key-note">{t("to_exit")}</span>
          </DialogTitle>
        </Dialog>
        <LeaderboardModal
          open={leaderboardOpen}
          onClose={() => setLeaderboardOpen(false)}
          theme={theme}
        />
        <Menu
          anchorEl={wordListMenuAnchor}
          open={wordListMenuOpen}
          onClose={closeWordListMenu}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          // MUI 5.6 doesn't support `slotProps.paper` — use PaperProps. The
          // explicit `background` + `backgroundImage: none` is needed because
          // MUI Paper applies its own elevation gradient that would otherwise
          // wash out dark themes.
          PaperProps={{
            sx: {
              background: theme.background,
              backgroundImage: "none",
              color: theme.text,
              fontFamily: theme.fontFamily,
              border: `1px solid ${theme.textTypeBox}40`,
              minWidth: 220,
              "& .MuiMenuItem-root:hover": {
                background: `${theme.textTypeBox}1f`,
              },
              "& .MuiMenuItem-root.Mui-selected": {
                background: `${theme.stats}22`,
              },
              "& .MuiDivider-root": {
                borderColor: `${theme.textTypeBox}30`,
              },
            },
          }}
        >
          {(customWordLists || []).length === 0 && (
            <MenuItem disabled sx={{ fontSize: 12, opacity: 0.7, color: theme.textTypeBox }}>
              {t("custom_words_menu_empty")}
            </MenuItem>
          )}
          {(customWordLists || []).map((wl) => {
            const isActive = wl.id === activeWordListId;
            return (
              <MenuItem
                key={wl.id}
                onClick={() => {
                  closeWordListMenu();
                  if (!isActive && onActivateWordList) onActivateWordList(wl.id);
                }}
                sx={{
                  fontSize: 13,
                  color: isActive ? theme.stats : theme.text,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: theme.fontFamily,
                }}
              >
                <ListItemIcon sx={{ minWidth: 24, color: theme.stats }}>
                  {isActive ? <CheckIcon sx={{ fontSize: 16 }} /> : null}
                </ListItemIcon>
                <span style={{ flex: 1 }}>{wl.name}</span>
                <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 8, color: theme.textTypeBox }}>
                  {wl.language === CHINESE_MODE ? "中" : "EN"}
                </span>
              </MenuItem>
            );
          })}
          {(customWordLists || []).length > 0 && <Divider sx={{ borderColor: `${theme.textTypeBox}30` }} />}
          {hasActiveWordList && (
            <MenuItem
              onClick={() => {
                closeWordListMenu();
                if (onClearCustomWords) onClearCustomWords();
              }}
              sx={{ fontSize: 13, color: theme.text, fontFamily: theme.fontFamily }}
            >
              <ListItemIcon sx={{ minWidth: 24, color: theme.textTypeBox }}>
                <ClearIcon sx={{ fontSize: 16 }} />
              </ListItemIcon>
              {t("custom_words_menu_clear")}
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              closeWordListMenu();
              if (onCreateWordList) onCreateWordList();
            }}
            sx={{ fontSize: 13, color: theme.stats, fontFamily: theme.fontFamily }}
          >
            <ListItemIcon sx={{ minWidth: 24, color: theme.stats }}>
              <AddIcon sx={{ fontSize: 16 }} />
            </ListItemIcon>
            {t("custom_words_menu_new")}
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeWordListMenu();
              // Logo listens for this and opens Profile on the Word Lists tab —
              // gives users a direct path to rename/delete/import/export.
              window.dispatchEvent(
                new CustomEvent("eletypes-open-profile", { detail: { tab: "wordlists" } })
              );
            }}
            sx={{ fontSize: 13, color: theme.text, fontFamily: theme.fontFamily }}
          >
            <ListItemIcon sx={{ minWidth: 24, color: theme.textTypeBox }}>
              <SettingsIcon sx={{ fontSize: 16 }} />
            </ListItemIcon>
            {t("custom_words_menu_manage")}
          </MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default TypeBox;
