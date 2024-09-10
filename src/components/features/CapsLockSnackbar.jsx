import React from "react";
import { Slide } from "@mui/material";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";

const CapsLockSnackbar = ({open}) => {

  return (
    <div>
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Slide in={open} mountOnEnter unmountOnExit>
        <Alert className="alert" severity="warning" sx={{ width: "100%" }}>
          Caps Locked
        </Alert>
      </Slide>
    </Snackbar>
  </div>
  );
};

export default CapsLockSnackbar;