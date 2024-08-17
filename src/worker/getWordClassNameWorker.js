// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = function (e) {
    const {
      wordsInCorrect,
      wordIdx,
      currWordIndex,
      pacingStyle,
      PACING_PULSE,
    } = e.data;

    let className = "word";

    if (wordsInCorrect.has(wordIdx)) {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          className = "word error-word active-word";
        } else {
          className = "word error-word active-word-no-pulse";
        }
      } else {
        className = "word error-word";
      }
    } else {
      if (currWordIndex === wordIdx) {
        if (pacingStyle === PACING_PULSE) {
          className = "word active-word";
        } else {
          className = "word active-word-no-pulse";
        }
      }
    }

    postMessage(className);
  };
};
