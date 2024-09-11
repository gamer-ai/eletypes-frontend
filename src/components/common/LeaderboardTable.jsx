import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LeaderboardDialogSelect from './LeaderboardDialogSelect';

// Function to adjust color brightness
const adjustColorBrightness = (hex, percent) => {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.min(255, Math.max(0, r + (r * percent / 100)));
  g = Math.min(255, Math.max(0, g + (g * percent / 100)));
  b = Math.min(255, Math.max(0, b + (b * percent / 100)));

  const toHex = (c) => c.toString(16).padStart(2, '0');

  return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`;
};

// TableHeader Component
const TableHeader = ({ backgroundColor }) => (
  <TableHead>
    <TableRow style={{ backgroundColor }}>
      {['Rank', 'Username', 'Language', 'Difficulty', "Timer", 'WPM', 'Raw WPM', 'Accuracy'].map((header, idx) => (
        <TableCell key={idx} style={{ backgroundColor }}>
          {header}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const Row = ({ index, row, timer_duration, language, difficulty }) => {
  const scores = row.high_scores.languages[language]?.difficulties[difficulty]?.scores[timer_duration];
  return (
    <TableRow key={row.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.username}</TableCell>
      <TableCell>{language}</TableCell>
      <TableCell>{difficulty}</TableCell>
      <TableCell>{timer_duration}</TableCell>
      <TableCell>{scores?.wpm}</TableCell>
      <TableCell>{scores?.raw_wpm}</TableCell>
      <TableCell>{scores?.accuracy.toFixed(2) + '%'}</TableCell>
    </TableRow>
  );
};

const SkeletonRow = ({ baseColor, highlightColor }) => (
  <TableRow>
    {Array.from({ length: 8 }).map((_, index) => (
      <TableCell key={index}>
        <Skeleton baseColor={baseColor} highlightColor={highlightColor} width={(index === 1 || index === 2 || index === 3) ? 50 : 20} />
      </TableCell>
    ))}
  </TableRow>
);

const LeaderboardTable = ({ theme }) => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selections, setSelections] = useState({
    language: 'english',
    difficulty: 'normal',
    timer: '15',
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const loadData = useCallback(async () => {
    if (!hasMore) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/get_leaderboard_stats`, {
        params: {
          timer_duration: selections.timer,
          difficulty: selections.difficulty,
          language: selections.language,
          page,
          limit: 10
        }
      });
      const data = response.data.leaderboard;
      setRows(prevRows => {
        // Combine previous rows with new data
        const combinedRows = [...prevRows, ...data];

        // Sort the combined rows
        const sortedLeaderboard = combinedRows.sort((a, b) => {
          const aWpm = a.high_scores.languages[selections.language]?.difficulties[selections.difficulty]?.scores[selections.timer]?.wpm || 0;
          const bWpm = b.high_scores.languages[selections.language]?.difficulties[selections.difficulty]?.scores[selections.timer]?.wpm || 0;
          return bWpm - aWpm;
        });

        return sortedLeaderboard;
      });

      setHasMore(data?.leaderboard.length > 0);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, selections.timer, selections.language, selections.difficulty, hasMore]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setPage(1);
    setRows([]);
    setHasMore(true);
  }, [selections.timer, selections.language, selections.difficulty]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoading) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isLoading]);

  const baseColor = adjustColorBrightness(theme.textTypeBox, -40);
  const highlightColor = adjustColorBrightness(theme.textTypeBox, 40);

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-container" style={{ width: '100%' }}>
        <div className="leaderboard-title-and-filter">
          <h1 className="leaderboard-title">Leaderboard</h1>
          <LeaderboardDialogSelect setSelections={setSelections} selections={selections} theme={theme} />
        </div>
        <Paper sx={{ width: '100%', overflow: 'hidden', background: 'transparent', boxShadow: 'none' }}>
          <TableContainer style={{ maxHeight: 'calc(12 * 48.8px)', background: theme.background }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHeader backgroundColor={theme.background} />
              <TableBody>
                {rows.map((row, index) => (
                  <Row key={index} index={index} row={row} language={selections.language} difficulty={selections.difficulty} timer_duration={selections.timer} />
                ))}
                {isLoading && (
                  Array.from({ length: 10 }).map((_, index) => (
                    <SkeletonRow key={index} baseColor={baseColor} highlightColor={highlightColor} />
                  ))
                )}
              </TableBody>
            </Table>
            <div ref={loaderRef} style={{ height: '20px' }} />
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default LeaderboardTable;
