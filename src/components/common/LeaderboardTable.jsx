import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CSSTransition } from 'react-transition-group';

const fetchLeaderboard = async (page, limit, timer_duration) => {
  try {
    const response = await fetch(`http://localhost:8080/get_leaderboard_stats?timer_duration=${timer_duration}&page=${page}&limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { leaderboard: [] };
  }
};

// TableHeader Component
const TableHeader = ({ backgroundColor }) => (
  <TableHead>
    <TableRow>
      {['Rank', 'Username', 'WPM', 'Raw WPM', 'Accuracy'].map((header, idx) => (
        <TableCell key={idx} style={{ backgroundColor }}>
          {header}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const Row = ({ index, row, timer_duration }) => (
  <TableRow key={row.id}>
    <TableCell>{index + 1}</TableCell>
    <TableCell>{row.username}</TableCell>
    <TableCell>{row.high_scores[timer_duration].wpm}</TableCell>
    <TableCell>{row.high_scores[timer_duration].raw_wpm}</TableCell>
    <TableCell>{row.high_scores[timer_duration].accuracy.toFixed(2)}%</TableCell>
  </TableRow>
);

const SkeletonRow = () => (
  <TableRow>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableCell key={index}><Skeleton width={index === 1 ? 50 : 20} /></TableCell>
    ))}
  </TableRow>
);

const LeaderboardTable = ({ timer_duration, isLeadeboardOpen, theme }) => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const loadData = useCallback(async () => {
    if (!hasMore) return;
    setIsLoading(true);
    const data = await fetchLeaderboard(page, 10, timer_duration);
    setRows(prevRows => [...prevRows, ...data.leaderboard]);
    setHasMore(data.leaderboard.length > 0);
    setIsLoading(false);
  }, [page, timer_duration, hasMore]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  return (
    <CSSTransition
      in={isLeadeboardOpen}
      timeout={300}
      classNames="fade"
      unmountOnExit
    >
      <div className="leaderboard-overlay">
        <div className="leaderboard-container" style={{ width: '100%' }}>
          <h1 className="leaderboard-title">Leaderboard</h1>
          <Paper sx={{ width: '100%', overflow: 'hidden', background: 'transparent', boxShadow: 'none' }}>
            <TableContainer style={{ maxHeight: 'calc(12 * 48.8px)' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHeader backgroundColor={theme.background} />
                <TableBody>
                  {rows.map((row, index) => (
                    <Row key={index} index={index} row={row} timer_duration={timer_duration} />
                  ))}
                  {isLoading && (
                    Array.from({ length: 10 }).map((_, index) => (
                      <SkeletonRow key={index} />
                    ))
                  )}
                </TableBody>
              </Table>
              <div ref={loaderRef} style={{ height: '20px' }} />
            </TableContainer>
          </Paper>
        </div>
      </div>
    </CSSTransition>
  );
};

export default LeaderboardTable;
