import React, { useRef, useState } from "react";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";
import { useNavigate, NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import useGetDataFromServer from "../../hooks/useGetDataFromServer";

const Logo = ({ isFocusedMode, isMusicMode }) => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const token = cookies.token;
  const [isDisplay, setDisplay] = useState(false);
  const user = useGetDataFromServer(
    {},
    `${process.env.REACT_APP_SERVER_URL}/user-by-token/${token}`
  );

  const handleLogout = () => {
    removeCookie("token");
  };

  const handleClick = () => {
    setDisplay(!isDisplay);
  };

  return (
    <div
      className="header"
      style={{ visibility: isFocusedMode ? "hidden" : "visible" }}
    >
      <h1>
        Ele Types <KeyboardAltIcon fontSize="large" />
      </h1>
      <span className="sub-header">
        an elegant typing experience, just start typing
      </span>
      {!token ? (
        <div className="login-and-sign-up">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="sign-up-btn" onClick={() => navigate("/sign-up")}>
            Sign Up
          </button>
        </div>
      ) : (
        <figure className="profile">
          <div className="image" onClick={handleClick}>
            <img
              src="https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-09-1024.png"
              alt="profile"
            />
            <div
              className="links"
              style={{ display: isDisplay ? "grid" : "none" }}
            >
              <NavLink
                className="nav-link"
                activeClassName="active-link"
                exact
                to="/profile"
              >
                Profile
              </NavLink>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <figcaption>{user.username}</figcaption>
          <span>{user.email}</span>
        </figure>
      )}
    </div>
  );
};

export default Logo;
