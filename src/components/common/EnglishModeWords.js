import React, { memo, useCallback, useRef } from "react";

const EnglishModeWords = ({
  currWordIndex,
  isUltraZenMode,
  currentWords,
  status,
  wordSpanRefs,
  getWordClassName,
  getCharClassName,
  startIndex,
  getExtraCharsDisplay,
}) => {
  const containerRef = useRef(null);

  // Get word opacity for focus mode
  const getWordOpacity = useCallback(
    (globalIndex) =>
      Math.max(1 - Math.abs(globalIndex - currWordIndex) * 0.1, 0.1),
    [currWordIndex]
  );

  return (
    <div
      className="type-box"
      style={{ visibility: status === "finished" ? "hidden" : "visible" }}
      ref={containerRef}
    >
      <div className="words">
        {currentWords.map((word, i) => {
          const globalIndex = startIndex + i;

          return (
            <span
              key={globalIndex}
              ref={wordSpanRefs[globalIndex]}
              style={{
                opacity: isUltraZenMode ? getWordOpacity(globalIndex) : "1",
                transition: "500ms",
              }}
              className={getWordClassName(globalIndex)}
            >
              {word.split("").map((char, idx) => (
                <span
                  key={`word${globalIndex}_${idx}`}
                  className={getCharClassName(globalIndex, idx, char, word)}
                >
                  {char}
                </span>
              ))}
              {getExtraCharsDisplay(word, globalIndex)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default memo(EnglishModeWords);
