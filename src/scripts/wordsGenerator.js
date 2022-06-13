import randomWords from "random-words";
import {
  COMMON_WORDS,
  COMMON_CHINESE_WORDS,
} from "../constants/WordsMostCommon";
import {
  DEFAULT_DIFFICULTY,
  ENGLISH_MODE,
  CHINESE_MODE,
  DEFAULT_WORDS_COUNT,
} from "../constants/Constants";

const randomIntFromRange = (min, max) => {
  const minNorm = Math.ceil(min);
  const maxNorm = Math.floor(max);
  const idx = Math.floor(Math.random() * (maxNorm - minNorm + 1) + minNorm);
  return idx;
};

const wordsGenerator = (wordsCount, difficulty, languageMode) => {
  if (languageMode === ENGLISH_MODE) {
    if (difficulty === DEFAULT_DIFFICULTY) {
        const EnglishWordList = [];
        for (let i = 0; i < DEFAULT_WORDS_COUNT; i++) {
          const rand = randomIntFromRange(0, 550);
          EnglishWordList.push(COMMON_WORDS[rand]);
        }
        return EnglishWordList;
    }
    const randomWordsGenerated = randomWords({ exactly: wordsCount, maxLength: 7 });
    const words = [];
    for (let i = 0; i < wordsCount; i++) {
        words.push({key: randomWordsGenerated[i], val: randomWordsGenerated[i]});
      }
    return words;
  }
  return ["something", "went", "wrong"];
};

const chineseWordsGenerator = (languageMode) => {
  if (languageMode === CHINESE_MODE) {
    const ChineseWordList = [];
    for (let i = 0; i < DEFAULT_WORDS_COUNT; i++) {
      const rand = randomIntFromRange(0, 5000);
      ChineseWordList.push(COMMON_CHINESE_WORDS[rand]);
    }
    return ChineseWordList;
  }
};

export { wordsGenerator, chineseWordsGenerator };
