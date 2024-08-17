// eslint-disable-next-line no-restricted-globals
self.onmessage = function (e) {
  const { word, currChar, currCharIndex } = e.data;
  const char = word.split("")[currCharIndex];

  if (char !== currChar && char !== undefined) {
    postMessage({ type: "increment" });
  }
};
