import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Logout from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";

export default function AccountMenu({
  isAuthenticated,
  setIsAuthenticated,
  handleOpenSignupModal,
  handleOpenLoginModal,
  username,
  theme,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    handleClose();
    handleOpenLoginModal();
  };

  const handleLogout = () => {
    handleClose();
    removeCookie();
  };

  const handleSignup = () => {
    handleClose();
    handleOpenSignupModal();
  };

  const removeCookie = async () => {
    try {
      const response = await axios.delete("http://localhost:8080/logout");
      if (response.status === 200) {
        setIsAuthenticated(false);
        toast.success("Logout successfully.", {
          className: "custom-toast-success",
        });
      }

      console.log(response.data);
    } catch (error) {
      setIsAuthenticated(true);
      toast.error("Failed to logout.", {
        className: "custom-toast-error",
      });
      console.error("Error removing cookie:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          color: theme.textTypeBox,
        }}
      >
        {isAuthenticated && (
          <Typography sx={{ marginBottom: 0, color: theme.textTypeBox }}>
            {username}
          </Typography>
        )}
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2, color: theme.textTypeBox, cursor: "pointer" }} // Added cursor pointer
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <PersonIcon
              sx={{ width: 28, height: 28, color: theme.textTypeBox }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            backgroundColor: theme.background, // Menu background color from theme
            color: theme.text, // Menu text color from theme
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: theme.background,
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {isAuthenticated ? (
          <span>
            <MenuItem onClick={handleClose} sx={{ cursor: "pointer" }}>
              <PersonIcon
                sx={{ mr: 1.4, color: theme.text }}
                fontSize="medium"
              />
              My Profile
            </MenuItem>
            <Divider sx={{ backgroundColor: theme.textTypeBox }} />
            <MenuItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
              <Logout sx={{ mr: 1.4, color: theme.text }} fontSize="medium" />
              Logout
            </MenuItem>
          </span>
        ) : (
          <span>
            <MenuItem
              onClick={handleLogin}
              sx={{ color: theme.text, cursor: "pointer" }}
            >
              Login
            </MenuItem>
            <MenuItem
              onClick={handleSignup}
              sx={{ color: theme.text, cursor: "pointer" }}
            >
              Sign Up
            </MenuItem>
          </span>
        )}
      </Menu>
    </>
  );
}
