import React, { memo, useCallback, useMemo, useRef } from "react";

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

  // Memoized opacity value calculation
  const getWordOpacity = useCallback(
    (index) => Math.max(1 - Math.abs(index - currWordIndex) * 0.1, 0.1),
    [currWordIndex]
  );

  // Memoized container style
  const containerStyle = useMemo(
    () => ({ visibility: status === "finished" ? "hidden" : "visible" }),
    [status]
  );

  // Memoized transition style
  const transitionStyle = useMemo(() => ({ transition: "opacity 500ms" }), []);

  // Memoized rendering of words
  const renderedWords = useMemo(
    () =>
      currentWords.map((word, i) => {
        // Condition to skip rendering words outside the desired range
        if (i >= currWordIndex + 40) {
          return null;
        }

        const opacityValue = isUltraZenMode ? getWordOpacity(i) : 1;

        return (
          <div
            key={i}
            style={{
              opacity: opacityValue,
              ...transitionStyle,
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
      }),
    [
      currentWords,
      isUltraZenMode,
      getWordOpacity,
      getChineseWordKeyClassName,
      getChineseWordClassName,
      getCharClassName,
      getExtraCharsDisplay,
      wordSpanRefs,
    ]
  );

  return (
    <div className="type-box-chinese" style={containerStyle} ref={containerRef}>
      <div className="words">{renderedWords}</div>
    </div>
  );
};

export default memo(ChineseModeWords);
