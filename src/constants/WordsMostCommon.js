import Chinese5000WordsPinyin from '../assets/Vocab/Chinese5000WordsPinyin.json';
import EnglishMostFrequentWords from '../assets/Vocab/EnglishMostFrequentWords.json';
import Chinese1500IdiomsPinyin from '../assets/Vocab/Chinese1500IdiomsPinyin.json';


// The JSON vocab files are keyed objects ({"0": {...}, ...}) rather than
// arrays — normalize to plain arrays so consumers can rely on .length.
const COMMON_WORDS = Object.values(EnglishMostFrequentWords);
const COMMON_CHINESE_WORDS = Object.values(Chinese5000WordsPinyin);
const COMMON_CHINESE_IDIOMS_WORDS = Object.values(Chinese1500IdiomsPinyin);


export {
    COMMON_WORDS,
    COMMON_CHINESE_WORDS,
    COMMON_CHINESE_IDIOMS_WORDS
}