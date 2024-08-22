import React, { memo } from "react";

// Define the component
const EnglishModeWords = ({
  currentWords,
  currWordIndex,
  isFocusedMode,
  status,
  wordSpanRefs,
  getWordClassName,
  getCharClassName,
  getExtraCharsDisplay,
}) => {
  const wordMap = {};

  return (
    <div
      className="type-box"
      style={{ visibility: status === "finished" ? "hidden" : "visible" }}
    >
      <div className="words">
        {currentWords.map((word, i) => {
          // Use a HashMap (object) to store the word by its index
          if (!wordMap[i]) {
            wordMap[i] = word;
          }

          // Process the word immediately using the HashMap
          const opacityValue = Math.max(
            1 - Math.abs(i - currWordIndex) * 0.1,
            0.1
          );

          return (
            <span
              key={i}
              ref={wordSpanRefs[i]}
              style={{
                opacity: isFocusedMode ? opacityValue : "1",
                transition: "500ms",
              }}
              className={getWordClassName(i)}
            >
              {wordMap[i].split("").map((char, idx) => (
                <span
                  key={"word" + idx}
                  className={getCharClassName(i, idx, char, wordMap[i])}
                >
                  {char}
                </span>
              ))}
              {getExtraCharsDisplay(wordMap[i], i)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default memo(EnglishModeWords);
