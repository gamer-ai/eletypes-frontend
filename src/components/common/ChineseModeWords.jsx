import React, { memo, useCallback, useRef } from "react";
import SmoothCaret from "../features/TypeBox/SmoothCaret";

const ChineseModeWords = ({
  currentWords,
  currWordIndex,
  currCharIndex,
  wordsKey,
  chineseDisplayMode,
  isUltraZenMode,
  status,
  wordSpanRefs,
  startIndex,
  getChineseWordKeyClassName,
  getChineseWordClassName,
  getCharClassName,
  getExtraCharsDisplay,
  pacingStyle,
  theme,
}) => {
  const containerRef = useRef(null);

  // Hide with visibility (not display) so the layout box is preserved:
  // SmoothCaret measures the char spans' getBoundingClientRect and the
  // scroll logic reads the first span's offsets, both of which collapse
  // to zero when the element is display:none. Also theme-independent.
  // Note: in the dataset wordsKey is the hanzi, word (val) is the pinyin.
  const pinyinStyle =
    chineseDisplayMode === "hanzi" ? { visibility: "hidden" } : undefined;
  const hanziStyle =
    chineseDisplayMode === "pinyin" ? { visibility: "hidden" } : undefined;

  // The full-length wordSpanRefs (attached to each pinyin span below) serves
  // both the TypeBox scroll anchoring and the SmoothCaret measurement.
  const getWordOpacity = useCallback(
    (globalIndex) =>
      Math.max(1 - Math.abs(globalIndex - currWordIndex) * 0.1, 0.1),
    [currWordIndex]
  );

  return (
    <div
      className="type-box-chinese"
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
          const opacityValue = isUltraZenMode ? getWordOpacity(globalIndex) : 1;

          return (
            <div
              key={globalIndex}
              style={{
                opacity: opacityValue,
                transition: "500ms",
              }}
            >
              <span
                className={getChineseWordKeyClassName(globalIndex)}
                style={hanziStyle}
              >
                {wordsKey[globalIndex]}
              </span>
              <span
                className={getChineseWordClassName(globalIndex)}
                ref={wordSpanRefs[globalIndex]}
                style={pinyinStyle}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ChineseModeWords);
