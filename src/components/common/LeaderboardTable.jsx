import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LeaderboardDialogSelect from "./LeaderboardDialogSelect";
import { adjustColorBrightness } from "../utils/adjustColorBrightness";
import { debounce } from "../utils/debounce"; // Import the custom debounce function

const TableHeader = ({ backgroundColor, color }) => (
  <TableHead>
    <TableRow style={{ backgroundColor }}>
      {[
        "Rank",
        "Username",
        "Language",
        "Difficulty",
        "Timer",
        "WPM",
        "Raw WPM",
        "Accuracy",
      ].map((header, idx) => (
        <TableCell key={idx} style={{ backgroundColor, color }}>
          {header}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const Row = ({ index, row, timer_duration, language, difficulty, theme }) => {
  const scores =
    row.high_scores.languages[language]?.difficulties[difficulty]?.scores[
      timer_duration
    ];
  return (
    <TableRow key={row.id}>
      <TableCell style={{ color: theme.textTypeBox }}>{index + 1}</TableCell>
      <TableCell style={{ color: theme.textTypeBox }}>{row.username}</TableCell>
      <TableCell style={{ color: theme.textTypeBox }}>{language}</TableCell>
      <TableCell style={{ color: theme.textTypeBox }}>{difficulty}</TableCell>
      <TableCell style={{ color: theme.textTypeBox }}>
        {timer_duration}
      </TableCell>
      <TableCell style={{ color: theme.textTypeBox }}>{scores?.wpm}</TableCell>
      <TableCell style={{ color: theme.textTypeBox }}>
        {scores?.raw_wpm}
      </TableCell>
      <TableCell style={{ color: theme.textTypeBox }}>
        {scores?.accuracy.toFixed(2) + "%"}
      </TableCell>
    </TableRow>
  );
};

const SkeletonRow = ({ baseColor, highlightColor }) => (
  <TableRow>
    {Array.from({ length: 8 }).map((_, index) => (
      <TableCell key={index}>
        <Skeleton
          baseColor={baseColor}
          highlightColor={highlightColor}
          width={index === 1 || index === 2 || index === 3 ? 50 : 20}
        />
      </TableCell>
    ))}
  </TableRow>
);

const LeaderboardTable = ({ theme, onCloseModal }) => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selections, setSelections] = useState({
    language: "english",
    difficulty: "normal",
    timer: "15",
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const reset = () => {
    setRows([]);
    setPage(1);
    setHasMore(true);
    setSelections({
      language: "english",
      difficulty: "normal",
      timer: "15",
    });
  };

  useEffect(() => {
    if (onCloseModal) {
      onCloseModal(reset);
    }
  }, [onCloseModal]);

  // Custom debounced loadData function
  const loadData = useCallback(
    debounce(async () => {
      if (!hasMore || isLoading) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/get_leaderboard_stats`,
          {
            params: {
              timer_duration: selections.timer,
              difficulty: selections.difficulty,
              language: selections.language,
              page,
              limit: 10,
            },
          },
        );

        const { leaderboard, total_count } = response.data;

        setRows((prevRows) => {
          const combinedRows = [...prevRows, ...leaderboard];

          if (combinedRows.length >= total_count) {
            setHasMore(false);
          }

          const sortedLeaderboard = combinedRows.sort((a, b) => {
            const aWpm =
              a.high_scores.languages[selections.language]?.difficulties[
                selections.difficulty
              ]?.scores[selections.timer]?.wpm || 0;
            const bWpm =
              b.high_scores.languages[selections.language]?.difficulties[
                selections.difficulty
              ]?.scores[selections.timer]?.wpm || 0;
            return bWpm - aWpm;
          });

          return sortedLeaderboard;
        });
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [hasMore, selections, isLoading, page],
  );

  useEffect(() => {
    loadData();
  }, [selections, page]);

  useEffect(() => {
    setPage(1);
    setRows([]);
    setHasMore(true);
  }, [selections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        rootMargin: "200px", // Adjust this to trigger earlier if needed
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading, hasMore]);

  const baseColor = adjustColorBrightness(theme.textTypeBox, -40);
  const highlightColor = adjustColorBrightness(theme.textTypeBox, 40);

  return (
    <div className="leaderboard-overlay">
      <div
        className="leaderboard-container"
        style={{ width: "100%", height: "auto" }}
      >
        <div className="leaderboard-title-and-filter">
          <h1 className="leaderboard-title">Leaderboard</h1>
          <LeaderboardDialogSelect
            setSelections={setSelections}
            selections={selections}
            theme={theme}
          />
        </div>
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
            background: "transparent",
            boxShadow: "none",
          }}
        >
          <TableContainer
            style={{
              maxHeight: "calc(12 * 48px)",
              background: theme.background,
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHeader
                color={theme.textTypeBox}
                backgroundColor={theme.background}
              />
              <TableBody>
                {rows.map((row, index) => (
                  <Row
                    theme={theme}
                    key={index}
                    index={index}
                    row={row}
                    language={selections.language}
                    difficulty={selections.difficulty}
                    timer_duration={selections.timer}
                  />
                ))}
                {isLoading &&
                  Array.from({ length: 10 }).map((_, index) => (
                    <SkeletonRow
                      key={index}
                      baseColor={baseColor}
                      highlightColor={highlightColor}
                    />
                  ))}
              </TableBody>
            </Table>
            <div ref={loaderRef} style={{ height: "20px" }} />
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default LeaderboardTable;
