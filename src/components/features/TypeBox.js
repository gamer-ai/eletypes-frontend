import React, { useEffect, useState, useMemo } from "react";
import { wordsGenerator } from "../../scripts/wordsGenerator";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IconButton from '@mui/material/IconButton';


const TypeBox = ({ textInputRef }) => {
  // constants
  const WORDS_COUNT = 300;
  const COUNT_DOWN = 60;
  // set up words state
  const [words, setWords] = useState([]);
  const wordSpanRefs = useMemo(() => Array(WORDS_COUNT).fill(0).map(i=> React.createRef()), []);
  
  // set up timer state
  const [countDown, setCountDown] = useState(COUNT_DOWN);
  const [showRestart, setShowRestart] = useState(false);
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
  const [wpm, setWpm] = useState(0);
  
  

  // set up char examine hisotry
  const [history, setHistory] = useState({});

  const keyString = currWordIndex + "." + currCharIndex;
  const [currChar, setCurrChar] = useState("");

  useEffect(() => {
    setWords(wordsGenerator(WORDS_COUNT));
  }, []);


  useEffect(() => {
    if (currWordIndex !== 0 && wordSpanRefs[currWordIndex].current.offsetLeft < wordSpanRefs[currWordIndex - 1].current.offsetLeft){
      wordSpanRefs[currWordIndex-1].current.scrollIntoView(); 
    }
    else{
      return;
    }
  }, [currWordIndex, wordSpanRefs]);

  // function restart(){
  //   setStatus('finished');
  //   start();
  // }

  function start() {
    //textInputRef.current.focus();
    if (status === "finished") {
      setWords(wordsGenerator(WORDS_COUNT));
      setCurrWordIndex(0);
      setCurrCharIndex(-1);
      setCurrChar("");
      setHistory({});
      setInputWordsHistory({});
      setWordsCorrect(new Set());
      setWordsInCorrect(new Set());
      setShowRestart(false);
      setStatus("waiting");
      textInputRef.current.focus();
    }

    if (status !== "started") {
      setStatus("started");
      //setCountDown(COUNT_DOWN);
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            setPrevInput("");
            setShowRestart(true);
            return COUNT_DOWN;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  }
  function UpdateInput (e) {
    if (status === 'finished'){
      return;
    }
    setCurrInput(e.target.value);
    inputWordsHistory[currWordIndex] = e.target.value.trim();
    setInputWordsHistory(inputWordsHistory);
  }
  function handleKeyDown({ keyCode, key }) {
    if (status === 'finished'){
      setCurrInput("");
      setPrevInput("");
      return;
    }

    const currWpm = wordsCorrect.size/(COUNT_DOWN - countDown)*(COUNT_DOWN);
    setWpm(currWpm);
    // start the game by typing any thing
    if (status !== "started" && status !== "finished") {
      start();
    }

    // space bar
    if (keyCode === 32) {
    const prevCorrectness = checkPrev();
    // advance to next regardless prev correct/not
    if (prevCorrectness === true || prevCorrectness === false) {
      // console.log('history')
      // console.log(inputWordsHistory)
        // reset currInput
        setCurrInput("");
        // advance to next
        setCurrWordIndex(currWordIndex + 1);
        setCurrCharIndex(-1);
        return;
    }
    else{
        // but don't allow entire word skip
        console.log('entire word skip not allowed');
        return;
    }

      // backspace
    } else if (keyCode === 8) {

      // delete the mapping match records
      delete history[keyString];

      // avoid over delete
      if (currCharIndex < 0) {
          // only allow delete prev word, rewind to previous
          if (wordsInCorrect.has(currWordIndex - 1)){
              console.log('detected prev incorrect, rewinding to previous')
              const prevInputWord = inputWordsHistory[currWordIndex - 1];
              // console.log(prevInputWord + " ")
              setCurrInput(prevInputWord + " ");
              setCurrCharIndex(prevInputWord.length - 1);
              setCurrWordIndex(currWordIndex - 1);
              setPrevInput(prevInputWord);
              return;
          }
        return;
      }
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }
  const getExtraCharsDisplay = (word, i) => {

      let input = inputWordsHistory[i];
      if (!input){
        input = currInput.trim();
      }
      if (i > currWordIndex){
          return null;
      }
      if (input.length <= word.length){
          return null;
      }
      else{
        const extra = input.slice(word.length, input.length);
        return (extra.split("").map((c, idx) => (
          <>
            <span key={"extra" + idx} className="error-char">
              {c}
            </span>
          </>
        )));
      }
  }
  function checkPrev() {
    const wordToCompare = words[currWordIndex];
    const currInputWithoutSpaces = currInput.trim();
    const isCorrect = wordToCompare === currInputWithoutSpaces;
    if (!currInputWithoutSpaces || currInputWithoutSpaces.length === 0){
        return null;
    }
    if (isCorrect){
        console.log('detected match');
        wordsCorrect.add(currWordIndex);
        wordsInCorrect.delete(currWordIndex);
        let inputWordsHistoryUpdate = {...inputWordsHistory};
        inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
        setInputWordsHistory(inputWordsHistoryUpdate);
        // reset prevInput to empty (will not go back)
        setPrevInput("");
        return true;
    }
    else{
        console.log("detected unmatched");
        wordsInCorrect.add(currWordIndex);
        wordsCorrect.delete(currWordIndex);
        let inputWordsHistoryUpdate = {...inputWordsHistory};
        inputWordsHistoryUpdate[currWordIndex] = currInputWithoutSpaces;
        setInputWordsHistory(inputWordsHistoryUpdate);

        // append currInput to prevInput
        setPrevInput(prevInput + " " + currInputWithoutSpaces);
        return false;
    }
  }
  function getWordClassName(wordIdx){
      if (wordsInCorrect.has(wordIdx)){
          return "word error-word";
      }
      else{
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
      <div className="type-box">
        <div className="words">
          {words.map((word, i) => (
            <span key={i} ref={wordSpanRefs[i]} className={getWordClassName(i)}>
              {word.split("").map((char, idx) => (
                  <span key={"word" + idx} className={getCharClassName(i, idx, char)}>
                    {char}
                  </span>
              ))}
              {getExtraCharsDisplay(word, i)}
            </span>

          ))}
        </div>
      </div>
      <div className="stats">
      <h3>{  countDown} s   </h3>
      <h3>WPM: {Math.round(wpm)}</h3>
      <div className="restart-button" key="restart-button">
      {showRestart && <IconButton aria-label="restart" color="secondary" size="medium" onClick = {()=>{start()}}>
        <RestartAltIcon fontSize="inherit" color="red"/>
      </IconButton>}
      </div>
      </div>
      <input
        key="hidden-input"
        ref={textInputRef}
        type="text"
        className="hidden-input"
        onKeyDown={handleKeyDown}
        value={currInput}
        onChange={(e) => UpdateInput(e)}
      />
    </>
  );
};

export default TypeBox;
