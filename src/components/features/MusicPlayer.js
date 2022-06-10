import React from "react";
import { Slide } from "@mui/material";

const MusicPlayer = ({disabled, isZenMode}) => {
  const players = {
    spotify:
      '<iframe style="border-radius:20px" src="https://open.spotify.com/embed/playlist/2HeW8KNgI5nOZf0yOdO6Mf?utm_source=generator&theme=0" width="100%" height="200" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>',
    spotifyCompact: '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2HeW8KNgI5nOZf0yOdO6Mf?utm_source=generator&theme=0" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>'
  };

  const IframePlayer = (props) => {
    if (disabled){
        return null;
    }
    return (
      <div
        dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
      />
    );
  };

  return (
    <Slide in={!disabled} mountOnEnter unmountOnExit>
    <div>
      <IframePlayer iframe={isZenMode ? players["spotifyCompact"] : players["spotify"]}/>
    </div>
    </Slide>
  );
};

export default MusicPlayer;
