import randomWords from "random-words";
// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
  const {
    ENGLISH_MODE,
    COMMON_WORDS,
    DEFAULT_DIFFICULTY,
    DEFAULT_WORDS_COUNT,
    wordsCount,
    difficulty,
    languageMode,
    numberAddOn,
    symbolAddOn,
  } = e.data;

  const randomIntFromRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const generateRandomNumChras = (min, max) =>
    String.fromCharCode(randomIntFromRange(min, max) + 48);
  const generateRandomSymbolChras = (min, max) =>
    String.fromCharCode(randomIntFromRange(min, max) + 33);

  const wordsGenerator = (
    wordsCount,
    difficulty,
    languageMode,
    numberAddOn,
    symbolAddOn
  ) => {
    if (languageMode === ENGLISH_MODE) {
      if (difficulty === DEFAULT_DIFFICULTY) {
        const EnglishWordList = [];
        for (let i = 0; i < DEFAULT_WORDS_COUNT; i++) {
          const rand = randomIntFromRange(0, 550);
          let wordCandidate = COMMON_WORDS[rand].val;
          if (numberAddOn) {
            wordCandidate = wordCandidate + generateRandomNumChras(1, 2);
          }
          if (symbolAddOn) {
            wordCandidate = wordCandidate + generateRandomSymbolChras(1, 1);
          }
          EnglishWordList.push({ key: wordCandidate, val: wordCandidate });
        }
        return EnglishWordList;
      }

      // Hard difficulty
      const randomWordsGenerated = randomWords({
        exactly: wordsCount,
        maxLength: 7,
      });
      const words = [];
      for (let i = 0; i < wordsCount; i++) {
        let wordCandidate = randomWordsGenerated[i];
        if (numberAddOn) {
          wordCandidate = wordCandidate + generateRandomNumChras(1, 2);
        }
        if (symbolAddOn) {
          wordCandidate = wordCandidate + generateRandomSymbolChras(1, 1);
        }
        words.push({ key: wordCandidate, val: wordCandidate });
      }
      return words;
    }
    return ["something", "went", "wrong"];
  };

  const result = wordsGenerator(
    wordsCount,
    difficulty,
    languageMode,
    numberAddOn,
    symbolAddOn
  );

  postMessage(result);
};
