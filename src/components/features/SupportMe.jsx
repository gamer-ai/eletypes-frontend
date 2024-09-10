import React from "react";
import WechatQRCode from "../../assets/WeChatSupport.png";
import { SUPPORT_TOOLTIP_TITLE } from "../../constants/Constants";
import { Tooltip } from "@mui/material";
import IconButton from "../utils/IconButton";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

const SupportMe = () => {
  return (
    <Tooltip
      title={
        <div>
          <span style={{ whiteSpace: "pre-line", fontSize: "12px" }}>
            {SUPPORT_TOOLTIP_TITLE}
          </span>
          <img
            className="support-me-image"
            src={WechatQRCode}
            alt="WechatQRCode"
          />
          <span style={{ whiteSpace: "pre-line" }}>
            <a href="https://www.buymeacoffee.com/daguozi">
              <img
                className="support-me-image"
                alt="buy-me-a-coffee"
                src="https://img.buymeacoffee.com/button-api/?text=or Buy me a coffee&emoji=&slug=daguozi&button_colour=FFDD00&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=ffffff"
              />
            </a>
          </span>
        </div>
      }
      placement="top-start"
    >
      <IconButton color="inherit">
        <VolunteerActivismIcon className="support-me"></VolunteerActivismIcon>
      </IconButton>
    </Tooltip>
  );
};

export default SupportMe;
