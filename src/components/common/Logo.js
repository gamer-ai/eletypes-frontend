import React from "react";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import { NavLink } from "react-router-dom";
import { Box } from "@mui/material";
import IconButton from "../utils/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";

const Logo = ({ isFocusedMode, isMusicMode }) => {
  return (
    <>
      <div className="header">
        <div style={{ visibility: isFocusedMode ? "hidden" : "visible" }}>
          <h1>
            Ele Types <KeyboardAltIcon fontSize="large" />
          </h1>
          <span className="sub-header">
            an elegant typing experience, just start typing
          </span>
        </div>
        <Box display="flex" justifyContent="left" alignItems="center">
          <NavLink to="/">
            {" "}
            <IconButton>
              <HomeIcon></HomeIcon>
            </IconButton>
          </NavLink>
          
          <NavLink to="/user">
            {" "}
            <IconButton>
              <PersonIcon></PersonIcon>
            </IconButton>{" "}
          </NavLink>
        </Box>
      </div>
    </>
  );
};

export default Logo;
