// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = function (e) {
    const { wpmKeyStrokes, countDownConstant, countDown } = e.data;

    const currWpm =
      (wpmKeyStrokes / 5 / (countDownConstant - countDown)) * 60.0;

    postMessage(currWpm);
  };
};
