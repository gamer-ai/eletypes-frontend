import React from "react";
import { COLLECT_TOOLTIP_TITLE } from "../../constants/Constants";
import { Tooltip } from "@mui/material";
import IconButton from "../utils/IconButton";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const CollectMe = () => {
  return (
    <Tooltip
      title={
        <div>
          <span style={{ whiteSpace: "pre-line", fontSize:"12px"}}>
            {COLLECT_TOOLTIP_TITLE}
          </span>
        </div>
      }
      placement="top"
    >
      <IconButton color="inherit">
        <AutoAwesomeIcon className="collect-me"></AutoAwesomeIcon>
      </IconButton>
    </Tooltip>
  );
};

export default CollectMe;