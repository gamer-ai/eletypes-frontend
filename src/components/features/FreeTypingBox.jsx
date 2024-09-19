import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import { SOUND_MAP } from "./sound/sound";

const FreeTypingBox = ({ spaces = 4, textAreaRef, soundMode, soundType }) => {
  const [text, setText] = useState({ value: "", caret: -1, target: null });

  const [play] = useSound(SOUND_MAP[soundType], { volume: 0.5 });

  useEffect(() => {
    if (text.caret >= 0) {
      text.target.setSelectionRange(text.caret + spaces, text.caret + spaces);
    }
  }, [text, spaces]);

  const handleTab = (e) => {
    let content = e.target.value;
    let caret = e.target.selectionStart;

    if (e.key === "Tab") {
      e.preventDefault();

      let newText =
        content.substring(0, caret) +
        " ".repeat(spaces) +
        content.substring(caret);

      setText({ value: newText, caret: caret, target: e.target });
    }
  };

  const handleText = (e) => {
    if (soundMode) {
      play();
    }
    setText({ value: e.target.value, caret: -1, target: e.target });
  };

  return (
    <div className="novelty-container">
      <textarea
        onChange={handleText}
        onKeyDown={handleTab}
        value={text.value}
        ref={textAreaRef}
        className="textarea"
        spellCheck="false"
        placeholder=" ... "
      />
    </div>
  );
};

export default FreeTypingBox;
