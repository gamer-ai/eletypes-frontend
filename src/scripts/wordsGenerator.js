import randomWords from 'random-words';
import { COMMON_WORDS } from '../constants/WordsMostCommon';
import { DEFAULT_DIFFICULTY } from '../constants/Constants';

const randomIntFromRange = (min, max) => {
    const minNorm = Math.ceil(min);
    const maxNorm = Math.floor(max);
    const idx =  Math.floor(Math.random() * (maxNorm - minNorm + 1) + minNorm);
    return idx;
    }

const wordsGenerator = (wordsCount, difficulty) => {
    if (difficulty === DEFAULT_DIFFICULTY){
        const randomStart = randomIntFromRange(0, wordsCount);
        const words = COMMON_WORDS.slice(randomStart, randomStart + wordsCount);
        return words;
    }
    const words = randomWords({exactly: wordsCount, maxLength: 7});
    return words;
};

export {wordsGenerator}