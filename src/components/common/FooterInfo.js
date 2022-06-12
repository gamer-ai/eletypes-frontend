import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "@mui/material";
import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import SupportMe from "../features/SupportMe";
import { GITHUB_TOOLTIP_TITLE } from "../../constants/Constants";

const FooterInfo = ({ disabled }) => {
  if (disabled) return null;
  return (
    <Box display="block" flexDirection="row" className="bottom-info">
    <SupportMe></SupportMe>
    <Tooltip
      title={
        <span style={{ whiteSpace: "pre-line" }}>
          {GITHUB_TOOLTIP_TITLE}
        </span>
      }
      placement="top"
    >
      <IconButton
        href="https://github.com/gamer-ai/eletype-frontend/"
        color="inherit"
      >
        <GitHubIcon></GitHubIcon>
      </IconButton>
    </Tooltip>
    <Link
      color="inherit"
      margin="inherit"
      underline="none"
      href="https://github.com/gamer-ai/eletype-frontend/blob/main/LICENSE"
    >
      &copy;GPLv3
    </Link>
    <span>{"    "}</span>
    <Link
      color="inherit"
      margin="inherit"
      underline="none"
      href="https://muyangguo.xyz"
    >
      @Muyang Guo
    </Link>
  </Box>
  );
};

export default FooterInfo;