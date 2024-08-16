import React from "react";
import { IconButton, Typography, Box } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const SocialLinksModal = ({ open, onClose, projectUrl }) => {
  if (!open) return null; // Prevent rendering if the modal is not open

  const shareText = "Check out this typing test project!";

  // Handle clicks on the overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Typography variant="h6" gutterBottom className="modal-title">
          Share Our Typing Test Project!
        </Typography>
        <Typography variant="body1" paragraph className="modal-description">
          Help us spread the word:
        </Typography>
        <Box
          display="flex"
          gap={2}
          justifyContent="center"
          className="modal-icons"
        >
          <IconButton
            color="inherit"
            component="a"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              projectUrl
            )}&quote=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook />
          </IconButton>
          <IconButton
            color="inherit"
            component="a"
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              projectUrl
            )}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter />
          </IconButton>
          <IconButton
            color="inherit"
            component="a"
            href={`https://www.instagram.com/?url=${encodeURIComponent(
              projectUrl
            )}`} // Instagram does not support custom messages
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram />
          </IconButton>
          <IconButton
            color="inherit"
            component="a"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              projectUrl
            )}&title=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedIn />
          </IconButton>
        </Box>
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          <span style={{ fontSize: "24px" }} className="close-button">
            ×
          </span>
        </IconButton>
      </div>
    </div>
  );
};

export default SocialLinksModal;
