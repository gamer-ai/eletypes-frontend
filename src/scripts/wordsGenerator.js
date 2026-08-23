import { wordList as hardWordList } from "random-words";
import {
  COMMON_WORDS,
  COMMON_CHINESE_WORDS,
  COMMON_CHINESE_IDIOMS_WORDS,
} from "../constants/WordsMostCommon";
import {
  DEFAULT_DIFFICULTY,
  HARD_DIFFICULTY,
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

// hard — select from random-words wordList with seeded RNG for determinism
const HARD_ENGLISH_WORDS = hardWordList.filter((w) => w.length <= 7);

// Draw indices against bank.length - 1 so the bound always stays in sync
// with the selected word bank. Previously each mode had its own hardcoded
// range (e.g. Chinese idioms drew 0..5000 against a 1500-entry list), which
// silently shrank generated batches when the range exceeded the bank size.
// Swapping a word list now only requires updating this map — nothing else.
const WORD_BANK_BY_MODE = {
  [ENGLISH_MODE]: {
    [DEFAULT_DIFFICULTY]: COMMON_WORDS,
    [HARD_DIFFICULTY]: HARD_ENGLISH_WORDS,
  },
  [CHINESE_MODE]: {
    [DEFAULT_DIFFICULTY]: COMMON_CHINESE_WORDS,
    [HARD_DIFFICULTY]: COMMON_CHINESE_IDIOMS_WORDS,
  },
};

const generateWordsFromBank = (bank, count, numberAddOn, symbolAddOn, rng) => {
  const wordList = [];
  const bankLength = bank.length;
  for (let i = 0; i < count; i++) {
    const rand = randomIntFromRange(0, bankLength - 1, rng);
    const entry = bank[rand];
    // guard against sparse banks — the draw range stays within bank.length,
    // so this only fires when a bank entry itself is missing/empty
    if (!entry) {
      continue;
    }
    // banks store either { key, val } objects (vocab JSON) or plain strings
    // (random-words wordList) — normalize both to { key, val }
    let wordCandidateKey =
      typeof entry === "string" ? entry : entry.key;
    let wordCandidateVal =
      typeof entry === "string" ? entry : entry.val;
    if (!wordCandidateKey || !wordCandidateVal) {
      continue;
    }
    if (numberAddOn) {
      const generatedNumber = generateRandomNumChras(1, 2, rng);
      wordCandidateKey = wordCandidateKey + generatedNumber;
      wordCandidateVal = wordCandidateVal + generatedNumber;
    }
    if (symbolAddOn) {
      const generatedSymbol = generateRandomSymbolChras(1, 1, rng);
      wordCandidateKey = wordCandidateKey + generatedSymbol;
      wordCandidateVal = wordCandidateVal + generatedSymbol;
    }

    wordList.push({
      key: wordCandidateKey,
      val: wordCandidateVal,
    });
  }

  return wordList;
};

const wordsGenerator = (
  wordsCount,
  difficulty,
  languageMode,
  numberAddOn,
  symbolAddOn,
  rng
) => {
  if (languageMode === ENGLISH_MODE) {
    return generateWordsFromBank(
      WORD_BANK_BY_MODE[ENGLISH_MODE][difficulty],
      wordsCount,
      numberAddOn,
      symbolAddOn,
      rng
    );
  }
  return ["something", "went", "wrong"];
};

const chineseWordsGenerator = (
  difficulty,
  languageMode,
  numberAddOn,
  symbolAddOn,
  rng
) => {
  if (languageMode === CHINESE_MODE) {
    return generateWordsFromBank(
      WORD_BANK_BY_MODE[CHINESE_MODE][difficulty],
      DEFAULT_WORDS_COUNT,
      numberAddOn,
      symbolAddOn,
      rng
    );
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
