// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
  const {
    countDown,
    countDownConstant,
    typingTestHistory,
    roundedWpm,
    roundedRawWpm,
    incorrectCharsCount,
  } = e.data;

  let shouldRecord = false;
  let increment = 1;

  switch (countDownConstant) {
    case 90:
    case 60:
    case 30:
      shouldRecord = countDown % 5 === 0;
      increment = 5;
      break;
    case 15:
      shouldRecord = true;
      increment = 1;
      break;
    default:
      shouldRecord = true;
      increment = 1;
  }

  if (shouldRecord) {
    const newTime = typingTestHistory.length * increment;

    const newEntry = {
      wpm: roundedWpm,
      rawWpm: roundedRawWpm,
      time: newTime,
      error: incorrectCharsCount,
    };

    postMessage({ newEntry, resetErrors: true });
  }
};
