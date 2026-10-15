// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
  const {
    countDown,
    countDownConstant,
    typingTestHistory,
    roundedWpm,
    roundedRawWpm,
    incorrectCharsCount,
    isInfiniteMode,
    elapsedSeconds,
  } = e.data;

  let shouldRecord = false;
  let increment = 1;

  if (isInfiniteMode) {
    // No countdown in infinite mode: record a point every 5 seconds based
    // on the elapsed-time counter instead of the countdown value.
    shouldRecord = elapsedSeconds > 0 && elapsedSeconds % 5 === 0;
    increment = 5;
  } else {
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
