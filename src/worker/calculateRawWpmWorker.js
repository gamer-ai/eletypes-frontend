// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
  const { rawKeyStrokes, countDownConstant, countDown } = e.data;

  const roundedRawWpm = Math.round(
    (rawKeyStrokes / 5 / (countDownConstant - countDown + 1)) * 60.0
  );

  postMessage(roundedRawWpm);
};
