import React from "react";
import { useRef, useEffect, useState } from "react";

const DefaultKeyboard = () => {
  const keyboardRef = useRef();
  const keys = [..." abcdefghijklmnopqrstuvwxyz "];
  useEffect(() => {
    keyboardRef.current && keyboardRef.current.focus();
  });
  const handleInputBlur = event => {
    keyboardRef.current && keyboardRef.current.focus();
  };

  const handleKeyDown = event => {
    if (event.key === randomKey) {
        setRandomKey(keys[getRandomKeyIndex()])
    }
    event.preventDefault();
    return;
  };
  const getRandomKeyIndex = () => {
    return Math.floor(Math.random() * 27);
    }

const [randomKey, setRandomKey] = useState(() => {
        return keys[getRandomKeyIndex()];
    });

  const getClassName = (keyString) => {

    if (keyString !== randomKey){
        return "UNITKEY"
    }
      return "UNITKEY VIBRATE";
  }
  const getSpaceKeyClassName = () => {
    if (" " !== randomKey){
        return "SPACEKEY"
    }
      return "SPACEKEY VIBRATE";
  }
  return (
    <div className="keyboard" >
    <input className="hidden-input" onBlur={handleInputBlur} onKeyDown={handleKeyDown} ref={keyboardRef}></input>
      <ul className="row row-1">
        <div className={getClassName("q")} id="Q">
          Q
        </div>
        <div className={getClassName("w")} id="W">
          W
        </div>
        <div className={getClassName("e")} id="E">
          E
        </div>
        <div className={getClassName("r")} id="R">
          R
        </div>
        <div className={getClassName("t")} id="T">
          T
        </div>
        <div className={getClassName("y")}id="Y">
          Y
        </div>
        <div className={getClassName("u")} id="U">
          U
        </div>
        <div className={getClassName("i")} id="I">
          I
        </div>
        <div className={getClassName("o")}id="O">
          O
        </div>
        <div className={getClassName("p")} id="P">
          P
        </div>
        <div className={getClassName("[")}>[</div>
        <div className={getClassName("]")}>]</div>
      </ul>
      <ul className="row row-2">
        <div className={getClassName("a")} id="A">
          A
        </div>
        <div className={getClassName("s")} id="S">
          S
        </div>
        <div className={getClassName("d")} id="D">
          D
        </div>
        <div className={getClassName("f")} id="F">
          F
        </div>
        <div className={getClassName("g")} id="G">
          G
        </div>
        <div className={getClassName("h")} id="H">
          H
        </div>
        <div className={getClassName("j")} id="J">
          J
        </div>
        <div className={getClassName("k")} id="K">
          K
        </div>
        <div className={getClassName("l")} id="L">
          L
        </div>
        <div className={getClassName(":")}>:</div>
        <div className={getClassName("''")}>''</div>
      </ul>
      <ul className="row row-3">
        <div className={getClassName("z")} id="Z">
          Z
        </div>
        <div className={getClassName("x")} id="X">
          X
        </div>
        <div className={getClassName("c")} id="C">
          C
        </div>
        <div className={getClassName("v")} id="V">
          V
        </div>
        <div className={getClassName("b")} id="B">
          B
        </div>
        <div className={getClassName("n")} id="N">
          N
        </div>
        <div className={getClassName("m")} id="M">
          M
        </div>
        <div className={getClassName(",")}>,</div>
        <div className={getClassName(".")}>.</div>
        <div className={getClassName(";")}>;</div>
      </ul>
      <ul className="row row-4">
        <div className={getSpaceKeyClassName()} id="SPACE">
          SPACE
        </div>
      </ul>
    </div>
  );
};

export default DefaultKeyboard;
