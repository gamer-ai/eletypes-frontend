import React, { memo, useCallback, useRef, useMemo } from "react";
import SmoothCaret from "../features/TypeBox/SmoothCaret";
import {
  HINT_MODE_BOTH,
  HINT_MODE_PINYIN_ONLY,
  HINT_MODE_CHINESE_ONLY,
} from "../../constants/Constants";

const ChineseModeWords = ({
  currentWords,
  currWordIndex,
  currCharIndex,
  wordsKey,
  chineseDisplayMode,
  isUltraZenMode,
  status,
  wordSpanRefs,
  getChineseWordKeyClassName,
  getChineseWordClassName,
  getCharClassName,
  getExtraCharsDisplay,
  pacingStyle,
  theme,
  hintMode = HINT_MODE_BOTH,
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

  // Separate refs for character spans (used by SmoothCaret)
  const charWordRefs = useMemo(
    () => currentWords.map(() => React.createRef()),
    [currentWords]
  );

  const getWordOpacity = useCallback(
    (index) => Math.max(1 - Math.abs(index - currWordIndex) * 0.1, 0.1),
    [currWordIndex]
  );

  const hideChinese = hintMode === HINT_MODE_PINYIN_ONLY;
  const hidePinyin = hintMode === HINT_MODE_CHINESE_ONLY;

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
          wordSpanRefs={charWordRefs}
          currWordIndex={currWordIndex}
          currCharIndex={currCharIndex}
          status={status}
          theme={theme}
        />
      )}
      <div className="words notranslate" translate="no">
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
                style={hanziStyle}
              >
                {wordsKey[i]}
              </span>
              <span
                className={getChineseWordClassName(i)}
                ref={charWordRefs[i]}
                style={pinyinStyle}
              >
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
