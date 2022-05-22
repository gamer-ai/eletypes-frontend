import randomWords from 'random-words';
import { COMMON_WORDS } from '../constants/WordsMostCommon';

function randomIntFromRange(min, max){
    const minNorm = Math.ceil(min);
    const maxNorm = Math.floor(max);
    const idx =  Math.floor(Math.random() * (maxNorm - minNorm + 1) + minNorm);
    return idx;
    }

const useCommonWords = true;
const wordsGenerator = (wordsCount) => {
    if (useCommonWords){
        const randomStart = randomIntFromRange(0, wordsCount);
        const words = COMMON_WORDS.slice(randomStart, randomStart + wordsCount);
        return words;
    }
    const words = randomWords({exactly: wordsCount/3, maxLength: 7});
    words.concat(randomWords({exactly: wordsCount/3, maxLength: 5}));
    words.concat(randomWords({exactly: wordsCount/3, maxLength: 3}));
    return words;
};


export {wordsGenerator}