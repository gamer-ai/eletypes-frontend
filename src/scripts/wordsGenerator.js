import randomWords from 'random-words';

const wordsGenerator = (wordsCount) => {
    const words = randomWords({exactly: wordsCount/3, maxLength: 7});
    words.concat(randomWords({exactly: wordsCount/3, maxLength: 5}));
    words.concat(randomWords({exactly: wordsCount/3, maxLength: 3}));
    return words;
};

export {wordsGenerator}