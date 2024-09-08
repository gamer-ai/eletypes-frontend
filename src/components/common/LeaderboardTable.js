import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from '@mui/material';

// Fetch leaderboard data
const fetchLeaderboard = async (page, limit, timer_duration) => {
  try {
    const response = await fetch(`http://localhost:8080/get_leaderboard_stats?timer_duration=${timer_duration}&page=${page}&limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { leaderboard: [] };
  }
};

// Table row component
const Row = ({ index, row, timer_duration }) => (
  <TableRow key={row.id}>
    <TableCell>{index + 1}</TableCell> {/* Ranking number */}
    <TableCell>{row.username}</TableCell>
    <TableCell>{row.high_scores[timer_duration].wpm}</TableCell>
    <TableCell>{row.high_scores[timer_duration].raw_wpm}</TableCell>
    <TableCell>{row.high_scores[timer_duration].accuracy.toFixed(2)}%</TableCell>
  </TableRow>
);

// Main leaderboard table component
const LeaderboardTable = ({ timer_duration, theme }) => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Items per page

  // Load data
  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchLeaderboard(page, limit, timer_duration);
    setRows(data.leaderboard);
    setIsLoading(false);
  };

  // Load data when page or timer_duration changes
  useEffect(() => {
    loadData();
  }, [page, timer_duration]);

  // Pagination control
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div className="leaderboard-container">
      <TableContainer component={Paper} style={{ backgroundColor: 'transparent' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell> {/* Ranking column */}
              <TableCell>Username</TableCell>
              <TableCell>WPM</TableCell>
              <TableCell>Raw WPM</TableCell>
              <TableCell>Accuracy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress sx={{ color: theme.text }} />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <Row key={row.id} index={index} row={row} timer_duration={timer_duration} />
              ))
            )}
          </TableBody>
        </Table>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
          <Button onClick={handlePrevPage} sx={{ color: theme.text }} disabled={page === 1} className="prev-btn">
            Previous
          </Button>
          <Button onClick={handleNextPage} sx={{ color: theme.text }} className="next-btn">
            Next
          </Button>
        </div>
      </TableContainer>
    </div>
  );
};

export default LeaderboardTable;
