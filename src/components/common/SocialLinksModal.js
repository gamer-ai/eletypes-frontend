import React, { useEffect, useState } from "react";
import { IconButton, Typography, Box } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const SocialLinksModal = ({ status }) => {
  const MODAL_DISPLAY_KEY = "modalDisplayedTimestamp"; // Key for local storage
  const COUNTDOWN_KEY = "countdownStartTime"; // Key for countdown start time
  const COUNTDOWN_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  // State to manage the modal's open/close state
  const [isShouldShowModal, setIsShouldShowModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState(COUNTDOWN_DURATION);

  // URL of your typing test project
  const projectUrl = "https://www.eletypes.com";
  const shareText = "Check out this typing test project!";

  const checkIfModalShouldBeDisplayed = () => {
    const lastDisplayed = localStorage.getItem(MODAL_DISPLAY_KEY);
    const countdownStartTime = parseInt(
      localStorage.getItem(COUNTDOWN_KEY),
      10
    );
    const now = new Date().getTime();

    if (
      !lastDisplayed ||
      now - parseInt(lastDisplayed, 10) >= COUNTDOWN_DURATION
    ) {
      // Show modal and record timestamp
      setIsShouldShowModal(true);
      localStorage.setItem(MODAL_DISPLAY_KEY, now.toString());
    }
  };

  const startCountdown = () => {
    const now = new Date().getTime();
    localStorage.setItem(COUNTDOWN_KEY, now.toString());
    checkIfModalShouldBeDisplayed();
  };

  const calculateRemainingTime = () => {
    const countdownStartTime = parseInt(
      localStorage.getItem(COUNTDOWN_KEY),
      10
    );
    const now = new Date().getTime();
    const elapsedTime = now - countdownStartTime;
    const timeLeft = COUNTDOWN_DURATION - elapsedTime;

    if (timeLeft <= 0) {
      setRemainingTime(0);
      localStorage.removeItem(COUNTDOWN_KEY); // Clear the countdown start time
      setIsShouldShowModal(true);
      localStorage.setItem(MODAL_DISPLAY_KEY, now.toString()); // Update modal display timestamp
    } else {
      setRemainingTime(timeLeft);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Initial setup and cleanup for countdown timer
  useEffect(() => {
    const now = new Date().getTime();

    // Start countdown if not already started
    if (!localStorage.getItem(COUNTDOWN_KEY)) {
      startCountdown();
    } else {
      calculateRemainingTime(); // Calculate remaining time if countdown already started
    }

    const timer = setInterval(calculateRemainingTime, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  // Manage cursor visibility and modal state based on status
  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];
    const delay = 500;
    let timeoutId;

    const showCursor = () => {
      body.style.cursor = "default";
      clearTimeout(timeoutId);
      timeoutId = setTimeout(hideCursor, delay); // Adjust timeout duration as needed
    };

    const hideCursor = () => {
      body.style.cursor = "none";
    };

    if (status === "started") {
      body.style.cursor = "none"; // Initially hide the cursor
      timeoutId = setTimeout(hideCursor, delay); // Set timeout to hide cursor after inactivity

      document.addEventListener("mousemove", showCursor);

      return () => {
        document.removeEventListener("mousemove", showCursor);
        clearTimeout(timeoutId); // Clear timeout on cleanup
        body.style.cursor = "default"; // Reset cursor style on cleanup
      };
    } else {
      // Ensure cursor is reset if status is not "started"
      body.style.cursor = "default";
    }

    if (status === "finished") {
      // Check and show modal if 5 minutes have passed
      const now = new Date().getTime();
      const countdownStartTime = parseInt(
        localStorage.getItem(COUNTDOWN_KEY),
        10
      );

      if (
        countdownStartTime &&
        now - countdownStartTime >= COUNTDOWN_DURATION
      ) {
        setIsShouldShowModal(true);
        localStorage.setItem(MODAL_DISPLAY_KEY, now.toString()); // Update modal display timestamp
      }

      // Reset countdown and modal if finished and should reset
      localStorage.removeItem(COUNTDOWN_KEY); // Clear countdown start time
      localStorage.removeItem(MODAL_DISPLAY_KEY); // Clear modal display timestamp
      setRemainingTime(COUNTDOWN_DURATION); // Reset remaining time
    }
  }, [status]);

  // Handle clicks on the overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsShouldShowModal(false);
    }
  };

  if (!isShouldShowModal || status !== "finished") {
    return null; // Do not render anything if the modal should not be shown
  }

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
          onClick={() => setIsShouldShowModal(false)}
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
