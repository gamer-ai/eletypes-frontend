const result = {};
// Parse CET4Words

function initData(){
    ParseCET4Words();
    ParseCET6Words();
    ParseGREWords();
}

// Parse CET4Words
const ParseCET4Words = () => {
    const CET4Words = require('../../../assets/Vocab/CET4Words.json');
    Object.keys(CET4Words).forEach((key) => {
        separator(CET4Words[key]?.key);
    });
};

// Parse CET6Words
const ParseCET6Words = () => {
    const CET6Words = require('../../../assets/Vocab/CET6Words.json');
    Object.keys(CET6Words).forEach((key) => {
        separator(CET6Words[key]?.key);
    });
};

// Parse GREWords
const ParseGREWords = () => {
    const GREWords = require('../../../assets/Vocab/GREWords.json');
    Object.keys(GREWords).forEach((key) => {
        separator(GREWords[key]?.key);
    });
};

// Function to create a data structure of separate words based on first character and length.
function separator(word) {
    if(word.includes('.') || !word) return;
    const firstChar = word.charAt(0).toLowerCase();
    const len = word.length;
    if (!result[firstChar]) {
        result[firstChar] = {};
    }
    if(!result[firstChar][len]){
        result[firstChar][len] =  new Set();
    }
    result[firstChar][len].add(word);
}

// Function to check if a word exists in the result
function isWordPresent(word) {
    if (!word) return false;
    const firstChar = word[0].toLowerCase();
    const len = word.length;
    return result[firstChar]?.[len]?.has(word) || false;
}

// Function to get a random word from the result
function getRandomWord(min, max) {

    // Pick a random first character
    const randomFirstChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    // Check if the character exists in the result
    if (!result[randomFirstChar]) {
        return getRandomWord(min, max); // Retry if no words exist for the character
    }

    const lengths = Object.keys(result[randomFirstChar]);
    const randomLength = lengths[Math.floor(Math.random() * lengths.length)];

    // Get a random word from the set
    const wordsSet = result[randomFirstChar][randomLength];
    const wordsArray = Array.from(wordsSet); // Convert Set to Array temporarily
    if (wordsArray.length === 0) {
        delete result[randomFirstChar][randomLength]; // Remove empty length set
        if (Object.keys(result[randomFirstChar]).length === 0) {
            delete result[randomFirstChar]; // Remove empty character entry
        }
        return getRandomWord(min, max); // Retry if no words are available
    }
    const word = wordsArray[Math.floor(Math.random() * wordsArray.length)]
    if (word.length >= min && word.length <= max) {
        wordsSet.delete(word); // Remove the guessed word from the set
        return word;
    }
    return getRandomWord(min, max);
}

export { isWordPresent, result, getRandomWord, initData };

// console.log(result);
// console.log(getRandomWord());
// console.log(isWordPresent("adult"));