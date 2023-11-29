import React from "react";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";

const Logo = ({ isFocusedMode, isMusicMode }) => {
  return (
    <div className="header" style={{visibility: isFocusedMode ? 'hidden' : 'visible' }}>
      <h1>
        Ele Types <KeyboardAltIcon fontSize="large" />
      </h1>
      <span className="sub-header">
        an elegant typing experience, just start typing
      </span>
      <figure className="profile">
        <img src="https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-09-1024.png" alt="profile" />
        <figcaption>Rendi Virgantara Setiawan</figcaption>
        <span>rendi@gmail.com</span>
      </figure>
    </div>
  );
};

export default Logo;
