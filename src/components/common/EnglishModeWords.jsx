import React, { memo, useCallback, useRef } from "react";
import SmoothCaret from "../features/TypeBox/SmoothCaret";

const EnglishModeWords = ({
  currWordIndex,
  currCharIndex,
  isUltraZenMode,
  currentWords,
  status,
  wordSpanRefs,
  getWordClassName,
  getCharClassName,
  startIndex,
  getExtraCharsDisplay,
  pacingStyle,
  theme,
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
      style={{
        visibility: status === "finished" ? "hidden" : "visible",
        position: "relative",
      }}
      ref={containerRef}
    >
      {pacingStyle === "caret" && (
        <SmoothCaret
          containerRef={containerRef}
          wordSpanRefs={wordSpanRefs}
          currWordIndex={currWordIndex}
          currCharIndex={currCharIndex}
          startIndex={startIndex}
          status={status}
          theme={theme}
        />
      )}
      <div className="words notranslate" translate="no">
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
