import React, { memo, useCallback, useRef, useMemo } from "react";

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

  // Memoized word opacity calculation
  const getWordOpacity = useCallback(
    (globalIndex) =>
      Math.max(1 - Math.abs(globalIndex - currWordIndex) * 0.1, 0.1),
    [currWordIndex]
  );

  // Memoized container styles
  const containerStyle = useMemo(
    () => ({ visibility: status === "finished" ? "hidden" : "visible" }),
    [status]
  );

  // Memoized transition style
  const transitionStyle = useMemo(() => ({ transition: "opacity 500ms" }), []);

  // Render the words with proper memoization and improved logic
  const renderedWords = useMemo(
    () =>
      currentWords.map((word, i) => {
        const globalIndex = startIndex + i;

        // Condition to skip rendering words outside the desired range
        if (globalIndex >= currWordIndex + 40) {
          return null;
        }

        return (
          <span
            key={globalIndex}
            ref={wordSpanRefs[globalIndex]}
            style={{
              opacity: isUltraZenMode ? getWordOpacity(globalIndex) : 1,
              ...transitionStyle,
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
      }),
    [
      currentWords,
      startIndex,
      isUltraZenMode,
      getWordOpacity,
      getWordClassName,
      getCharClassName,
      getExtraCharsDisplay,
      wordSpanRefs,
    ]
  );

  return (
    <div className="type-box" style={containerStyle} ref={containerRef}>
      <div className="words">{renderedWords}</div>
    </div>
  );
};

export default memo(EnglishModeWords);
