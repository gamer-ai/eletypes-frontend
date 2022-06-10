import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MusicOffIcon from "@mui/icons-material/MusicOff";
import { Tooltip } from "@mui/material";
import { MUSIC_MODE } from "../../constants/Constants";

const MusicIconButton = ({disabled}) => {
  if (disabled) {
    return (
    <Tooltip title={MUSIC_MODE}>
      <span className="zen-button">
        <MusicNoteIcon fontSize="medium"></MusicNoteIcon>
      </span>
    </Tooltip>
    )
  };
  return (
    <Tooltip title={MUSIC_MODE}>
      <span className="zen-button">
        <MusicOffIcon fontSize="medium"></MusicOffIcon>
      </span>
    </Tooltip>
  );
};

export default MusicIconButton;
