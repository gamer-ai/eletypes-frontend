// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = function (event) {
    const {
      words,
      currWordIndex,
      currInputWithoutSpaces,
      wordsCorrect,
      wordsInCorrect,
      inputWordsHistory,
      prevInput,
      wpmKeyStrokes,
    } = event.data;

    // Validate input data
    const wordToCompare = words[currWordIndex];
    const isCorrect = wordToCompare === currInputWithoutSpaces;

    // Ensure wpmKeyStrokes is a valid number
    const validWpmKeyStrokes =
      typeof wpmKeyStrokes === "number" && !isNaN(wpmKeyStrokes)
        ? wpmKeyStrokes
        : 0;

    // Check if the current input is empty
    if (!currInputWithoutSpaces || currInputWithoutSpaces.length === 0) {
      postMessage({ isCorrect: null });
      return;
    }

    let updatedWordsCorrect = new Set(wordsCorrect);
    let updatedWordsInCorrect = new Set(wordsInCorrect);
    let updatedInputWordsHistory = { ...inputWordsHistory };
    let updatedPrevInput = prevInput;
    let updatedWpmKeyStrokes = validWpmKeyStrokes;

    if (isCorrect) {
      updatedWordsCorrect.add(currWordIndex);
      updatedWordsInCorrect.delete(currWordIndex);
      updatedInputWordsHistory[currWordIndex] = currInputWithoutSpaces;
      updatedPrevInput = "";
      updatedWpmKeyStrokes += 1; // Increment only if valid
      postMessage({
        isCorrect: true,
        updatedWordsCorrect: Array.from(updatedWordsCorrect),
        updatedWordsInCorrect: Array.from(updatedWordsInCorrect),
        updatedInputWordsHistory,
        updatedPrevInput,
        updatedWpmKeyStrokes,
      });
    } else {
      updatedWordsInCorrect.add(currWordIndex);
      updatedWordsCorrect.delete(currWordIndex);
      updatedInputWordsHistory[currWordIndex] = currInputWithoutSpaces;
      updatedPrevInput += " " + currInputWithoutSpaces;
      postMessage({
        isCorrect: false,
        updatedWordsCorrect: Array.from(updatedWordsCorrect),
        updatedWordsInCorrect: Array.from(updatedWordsInCorrect),
        updatedInputWordsHistory,
        updatedPrevInput,
        updatedWpmKeyStrokes,
      });
    }
  };
};
