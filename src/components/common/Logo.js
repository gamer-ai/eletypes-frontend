import React from "react";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";

const Logo = ({ isFocusedMode }) => {

  return (
    <div className="header" style={{visibility: isFocusedMode ? 'hidden' : 'visible' }}>
      <h1>
        Ele Types <KeyboardAltIcon fontSize="large" />
      </h1>
      <span className="sub-header">
        an elegant typing experience, just start typing
      </span>
    </div>
  );
};

export default Logo;
