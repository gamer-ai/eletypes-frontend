import randomWords from "random-words";
import {
  COMMON_WORDS,
  COMMON_CHINESE_WORDS,
  COMMON_CHINESE_IDIOMS_WORDS,
} from "../constants/WordsMostCommon";
import {
  DEFAULT_DIFFICULTY,
  ENGLISH_MODE,
  CHINESE_MODE,
  DEFAULT_WORDS_COUNT,
} from "../constants/Constants";
import { randomIntFromRange } from "./randomUtils";
import {
  generateRandomNumChras,
  generateRandomSymbolChras,
} from "./randomCharsGenerator";
import {
  VOCAB_DICTIONARIES,
  DICTIONARY_SOURCE_CATALOG,
} from "../constants/DictionaryConstants";

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

    // hard
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

const chineseWordsGenerator = (
  difficulty,
  languageMode,
  numberAddOn,
  symbolAddOn
) => {
  if (languageMode === CHINESE_MODE) {
    if (difficulty === DEFAULT_DIFFICULTY) {
      const ChineseWordList = [];
      for (let i = 0; i < DEFAULT_WORDS_COUNT; i++) {
        const rand = randomIntFromRange(0, 5000);
        if (COMMON_CHINESE_WORDS[rand] && COMMON_CHINESE_WORDS[rand].val) {
          let wordCandidateKey = COMMON_CHINESE_WORDS[rand].key;
          let wordCandidateVal = COMMON_CHINESE_WORDS[rand].val;
          if (numberAddOn) {
            const generatedNumber = generateRandomNumChras(1, 2);
            wordCandidateKey = wordCandidateKey + generatedNumber;
            wordCandidateVal = wordCandidateVal + generatedNumber;
          }
          if (symbolAddOn) {
            const generatedSymbol = generateRandomSymbolChras(1, 1);
            wordCandidateKey = wordCandidateKey + generatedSymbol;
            wordCandidateVal = wordCandidateVal + generatedSymbol;
          }

          ChineseWordList.push({
            key: wordCandidateKey,
            val: wordCandidateVal,
          });
        }
      }

      return ChineseWordList;
    }

    const ChineseIdiomsList = [];
    for (let i = 0; i < DEFAULT_WORDS_COUNT; i++) {
      const rand = randomIntFromRange(0, 5000);
      if (
        COMMON_CHINESE_IDIOMS_WORDS[rand] &&
        COMMON_CHINESE_IDIOMS_WORDS[rand].val
      ) {
        let wordCandidateKey = COMMON_CHINESE_IDIOMS_WORDS[rand].key;
        let wordCandidateVal = COMMON_CHINESE_IDIOMS_WORDS[rand].val;
        if (numberAddOn) {
          const generatedNumber = generateRandomNumChras(1, 2);
          wordCandidateKey = wordCandidateKey + generatedNumber;
          wordCandidateVal = wordCandidateVal + generatedNumber;
        }
        if (symbolAddOn) {
          const generatedSymbol = generateRandomSymbolChras(1, 1);
          wordCandidateKey = wordCandidateKey + generatedSymbol;
          wordCandidateVal = wordCandidateVal + generatedSymbol;
        }
        ChineseIdiomsList.push({
          key: wordCandidateKey,
          val: wordCandidateVal,
        });
      }
    }

    return ChineseIdiomsList;
  }
};

const wordsCardVocabGenerator = (vocabSource, chapter) => {
  const wordsList = [];
  const chapterCatalog = DICTIONARY_SOURCE_CATALOG[vocabSource];
  const chapterStartIndex = chapterCatalog[chapter][0];
  const chapterEndIndex = chapterCatalog[chapter][1];
  for (let i = chapterStartIndex; i < chapterEndIndex + 1; i++) {
    wordsList.push(VOCAB_DICTIONARIES[vocabSource][i]);
  }
  return wordsList;
};

export { wordsGenerator, chineseWordsGenerator, wordsCardVocabGenerator };
