import React from "react";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AccountMenu from "./AccountMenu";
import { getModeButtonClassName } from "../../utils";

const Logo = ({
  isFocusedMode,
  theme,
  isAuthenticated,
  handleOpenLoginModal,
  handleOpenSignupModal,
  username,
  isLeadeboardOpen,
  setIsLeaderboardOpen,
}) => {
  const toggleLeaderboard = () => {
    setIsLeaderboardOpen(!isLeadeboardOpen);
  };

  return (
    <div className={`header ${isFocusedMode ? "hidden" : "visible"}`}>
      <div
        className="title-and-menu"
        style={{ opacity: isFocusedMode ? "0" : "1" }}
      >
        <h3 className="title">
          Ele Types <KeyboardAltIcon fontSize="medium" />
        </h3>
        <div className="separator"></div>
        <Tooltip title="Leaderboard">
          <IconButton
            onClick={toggleLeaderboard}
            className="leaderboard-button"
          >
            <LeaderboardIcon
              className={`leaderboard-icon ${getModeButtonClassName(isLeadeboardOpen)}`}
              fontSize="medium"
            />
          </IconButton>
        </Tooltip>
      </div>
      <div className="user-info" style={{ opacity: isFocusedMode ? "0" : "1" }}>
        <AccountMenu
          handleOpenLoginModal={handleOpenLoginModal}
          isAuthenticated={isAuthenticated}
          handleOpenSignupModal={handleOpenSignupModal}
          theme={theme}
          username={username}
        />
      </div>
    </div>
  );
};

export default Logo;
