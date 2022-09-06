import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import IconButton from "../utils/IconButton";
import { NavLink } from "react-router-dom";


const PageNotFound = () => {
  return (
    <div className="type-box">
        Sorry, page not found. Please go back or return to home page.
        <NavLink to="/">
        <IconButton>
            <HomeIcon></HomeIcon>
        </IconButton>
        </NavLink>
    </div>
  );
};

export default PageNotFound;
