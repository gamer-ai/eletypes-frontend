import React, { memo, useCallback, useRef } from "react";

const ChineseModeWords = ({
  currentWords,
  currWordIndex,
  isUltraZenMode,
  wordsKey,
  status,
  wordSpanRefs,
  getChineseWordKeyClassName,
  getChineseWordClassName,
  getCharClassName,
  getExtraCharsDisplay,
}) => {
  const containerRef = useRef(null);

  // Get word opacity for focus mode
  const getWordOpacity = useCallback(
    (index) => Math.max(1 - Math.abs(index - currWordIndex) * 0.1, 0.1),
    [currWordIndex]
  );

  return (
    <div
      className="type-box-chinese"
      style={{ visibility: status === "finished" ? "hidden" : "visible" }}
      ref={containerRef}
    >
      <div className="words">
        {currentWords.map((word, i) => {
          const opacityValue = isUltraZenMode ? getWordOpacity(i) : 1;

          return (
            <div
              key={i}
              style={{
                opacity: opacityValue,
                transition: "500ms",
              }}
            >
              <span
                className={getChineseWordKeyClassName(i)}
                ref={wordSpanRefs[i]}
              >
                {wordsKey[i]}
              </span>
              <span className={getChineseWordClassName(i)}>
                {word.split("").map((char, idx) => (
                  <span
                    key={`word${i}_${idx}`}
                    className={getCharClassName(i, idx, char, word)}
                  >
                    {char}
                  </span>
                ))}
                {getExtraCharsDisplay(word, i)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ChineseModeWords);
