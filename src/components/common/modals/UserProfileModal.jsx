import React, { useState, useEffect } from "react";
import { adjustColorBrightness } from "../../utils/adjustColorBrightness";
import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon

const UserProfileModal = ({ open, onClose, username, theme }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username && open) {
      fetchUserDetail();
    }
  }, [username, open]);

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/get_user_detail/${username}`,
      );
      if (!response.ok) throw new Error("Failed to fetch user details");
      const data = await response.json();
      setUserDetail(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingModal theme={theme} />;
  if (error) return <ErrorModal message={error} theme={theme} />;
  if (!userDetail) return null;

  const { completed_tests, high_scores, created_at } = userDetail;
  const groupedScores = groupScores(high_scores);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box sx={overlayStyle(theme)}>
        <Box sx={modalStyle(theme)}>
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                color: theme.textTypeBox,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Header
              username={username}
              completedTests={completed_tests}
              joinedAt={created_at}
              theme={theme}
            />
            <Divider sx={{ my: 4, borderColor: theme.textTypeBox }} />
            <Typography
              variant="h5"
              component="h3"
              fontWeight="bold"
              color={theme.title}
              gutterBottom
              sx={{ mb: 3 }} // Margin bottom for spacing
            >
              Detailed Scores
            </Typography>
            {Array.from(groupedScores.entries()).map(
              ([language, timerGroups]) => (
                <LanguageSection
                  key={language}
                  language={language}
                  timerGroups={timerGroups}
                  theme={theme}
                />
              ),
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

const overlayStyle = (theme) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: theme.background, // Fullscreen background
  display: "flex",
  alignItems: "start",
  justifyContent: "center", // Center content horizontally
  overflow: "auto",
  zIndex: 1300, // Ensure it sits above other elements
});

const modalStyle = (theme) => ({
  maxWidth: "xl",
  width: "100%", // Adjust width for better responsiveness
  height: "auto", // Adjust height based on content
  backgroundColor: theme.background,
  p: 4,
  fontFamily: theme.fontFamily,
});

const LoadingModal = ({ theme }) => (
  <Box
    sx={overlayStyle(theme)}
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <CircularProgress color="inherit" />
  </Box>
);

const ErrorModal = ({ message, theme }) => (
  <Box
    sx={overlayStyle(theme)}
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Typography variant="body1" color="error">
      Error: {message}
    </Typography>
  </Box>
);

const Header = ({ username, completedTests, joinedAt, theme }) => (
  <Box mb={4}>
    <Typography
      variant="h6"
      component="p"
      fontWeight="bold"
      color={theme.title}
      sx={{ mb: 1 }} // Margin bottom for spacing
    >
      Username: {username}
    </Typography>
    <Typography
      variant="body1"
      color={theme.textTypeBox}
      sx={{ mb: 0.5 }} // Margin bottom for spacing
    >
      Completed Tests: {completedTests || 0}
    </Typography>
    <Typography variant="body1" color={theme.textTypeBox}>
      Joined At: {formatDate(joinedAt)}
    </Typography>
  </Box>
);

const LanguageSection = ({ language, timerGroups, theme }) => (
  <Box sx={{ mt: 4 }}>
    <Typography
      variant="h6"
      component="h4"
      fontWeight="bold"
      color={theme.title}
      sx={{ mb: 2 }} // Margin bottom for spacing
    >
      {language}
    </Typography>
    <Grid container spacing={3}>
      {timerGroups.map((timerGroup) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={timerGroup.timer}>
          <ScoreCard timerGroup={timerGroup} theme={theme} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

const ScoreCard = ({ timerGroup, theme }) => (
  <Card
    variant="outlined"
    style={{
      backgroundColor: adjustColorBrightness(theme.background, 60),
      color: theme.textTypeBox,
    }}
  >
    <CardContent>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color={theme.title}
        sx={{ mb: 1 }} // Margin bottom for spacing
      >
        {timerGroup.timer} Seconds
      </Typography>
      {timerGroup.difficulties.map((difficultyGroup, index) => (
        <DifficultySection
          key={index}
          difficultyGroup={difficultyGroup}
          theme={theme}
        />
      ))}
    </CardContent>
  </Card>
);

const DifficultySection = ({ difficultyGroup, theme }) => (
  <Box sx={{ mt: 2 }}>
    <Typography
      variant="body2"
      color={theme.textTypeBox}
      sx={{ mb: 1 }} // Margin bottom for spacing
    >
      Difficulty: {difficultyGroup.difficulty}
    </Typography>
    <Divider sx={{ my: 1, borderColor: theme.textTypeBox }} />
    {difficultyGroup.scores ? (
      <>
        <Typography variant="body2">
          Date: {formatDate(difficultyGroup.scores.date)}
        </Typography>
        <Typography variant="body2">
          WPM: {difficultyGroup.scores.wpm}
        </Typography>
        <Typography variant="body2">
          Raw WPM: {difficultyGroup.scores.rawWpm}
        </Typography>
        <Typography variant="body2">
          Accuracy: {difficultyGroup.scores.accuracy}%
        </Typography>
      </>
    ) : (
      <Typography variant="body2" color={theme.textTypeBox}>
        No scores available
      </Typography>
    )}
  </Box>
);

const groupScores = (high_scores) => {
  const groupedScores = new Map();

  if (high_scores && high_scores.languages) {
    for (const [language, languageScores] of Object.entries(
      high_scores.languages,
    )) {
      const timers = ["15", "30", "60", "90"];
      const timerMap = new Map();

      for (const timer of timers) {
        const difficultyMap = new Map();

        for (const [difficulty, difficultyScores] of Object.entries(
          languageScores.difficulties,
        )) {
          const scores = difficultyScores.scores[timer] || null;

          if (scores) {
            difficultyMap.set(difficulty, {
              date: new Date(scores.date).toLocaleDateString(),
              wpm: scores.wpm,
              rawWpm: scores.raw_wpm,
              accuracy: scores.accuracy,
            });
          }
        }

        timerMap.set(
          timer,
          Array.from(difficultyMap.entries()).map(
            ([difficulty, scoreData]) => ({
              difficulty,
              scores: scoreData,
            }),
          ),
        );
      }

      groupedScores.set(
        language,
        Array.from(timerMap.entries()).map(([timer, difficulties]) => ({
          timer,
          difficulties,
        })),
      );
    }
  }

  return groupedScores;
};

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};

export default UserProfileModal;
