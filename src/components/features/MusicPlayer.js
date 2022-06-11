import React from "react";
import { Slide } from "@mui/material";

const MusicPlayer = ({ disabled, isZenMode }) => {
  const height = isZenMode ? "80" : "240";

  const players = {
    spotify:
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/07iwWrF9q54KJ8XaolRj5Y?utm_source=generator&theme=0" width="100%" height=' +
      height +
      ' frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>',
  };

  const IframePlayer = (props) => {
    if (disabled) {
      return null;
    }
    return (
      <div
        dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
      />
    );
  };

  return (
    <Slide
      direction="up"
      style={{ transitionDelay: disabled ? "200ms" : "0ms" }}
      in={!disabled}
      mountOnEnter
      unmountOnExit
    >
      <div>
        <IframePlayer iframe={players["spotify"]} />
      </div>
    </Slide>
  );
};

export default MusicPlayer;
