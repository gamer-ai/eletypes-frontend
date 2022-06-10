import React from "react";
import WechatQRCode from "../../assets/WeChatSupport.png";
import { SUPPORT_TOOLTIP_TITLE } from "../../constants/Constants";
import { Tooltip } from "@mui/material";
import IconButton from "../utils/IconButton";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

function SupportMe() {
  return (
    <Tooltip
      title={
        <div>
          <span style={{ whiteSpace: "pre-line" }}>
            {SUPPORT_TOOLTIP_TITLE}
          </span>
          <img
            className="support-me-image"
            src={WechatQRCode}
            alt="WechatQRCode"
          />
        </div>
      }
      placement="top"
    >
      <IconButton color="inherit">
        <VolunteerActivismIcon className="support-me"></VolunteerActivismIcon>
      </IconButton>
    </Tooltip>
  );
}

export default SupportMe;
