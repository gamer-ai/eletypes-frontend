const result = {};
// Parse CET4Words
const guessedWords = new Set(); // New set to track guessed words

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
    return result[firstChar]?.[len]?.has(word)  || guessedWords.has(word) || false;
}

// Function to get a random word from the result
function getRandomWord(min, max) {

    // Flatten all words into a single array
    const allWords = [];
    Object.values(result).forEach(lengthsObj => {
        Object.values(lengthsObj).forEach(wordsSet => {
            allWords.push(...Array.from(wordsSet));
        });
    });
    // Filter words based on the length constraints
    const filteredWords = allWords.filter(word => word.length >= min && word.length <= max);

    // Pick a random word from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const word = filteredWords[randomIndex];

    // Remove the selected word from the result structure
    const firstChar = word.charAt(0).toLowerCase();
    const len = word.length;
    result[firstChar][len].delete(word);

    // Add the word to guessedWords
    guessedWords.add(word);

    return word;
}

export { isWordPresent, result, getRandomWord, initData };

// console.log(result);
// console.log(getRandomWord());
// console.log(isWordPresent("adult"));