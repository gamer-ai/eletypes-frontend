// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = function (e) {
    const {
      wordIdx,
      charIdx,
      pacingStyle,
      PACING_CARET,
      currWordIndex,
      currCharIndex,
      status,
      history,
      char,
      currChar,
      word,
    } = e.data;

    const keyString = wordIdx + "." + charIdx;
    let className;

    if (
      pacingStyle === PACING_CARET &&
      wordIdx === currWordIndex &&
      charIdx === currCharIndex + 1 &&
      status !== "finished"
    ) {
      className = "caret-char-left";
    } else if (history[keyString] === true) {
      if (
        pacingStyle === PACING_CARET &&
        wordIdx === currWordIndex &&
        word.length - 1 === currCharIndex &&
        charIdx === currCharIndex &&
        status !== "finished"
      ) {
        className = "caret-char-right-correct";
      } else {
        className = "correct-char";
      }
    } else if (history[keyString] === false) {
      if (
        pacingStyle === PACING_CARET &&
        wordIdx === currWordIndex &&
        word.length - 1 === currCharIndex &&
        charIdx === currCharIndex &&
        status !== "finished"
      ) {
        className = "caret-char-right-error";
      } else {
        className = "error-char";
      }
    } else if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        history[keyString] = true;
        className = "correct-char";
      } else {
        history[keyString] = false;
        className = "error-char";
      }
    } else {
      if (wordIdx < currWordIndex) {
        // missing chars
        history[keyString] = undefined;
      }
      className = "char";
    }

    postMessage(className);
  };
};
