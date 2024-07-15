import React, { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { CHAR_TOOLTIP_TITLE } from "../../../constants/Constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as TooltipChart,
  ResponsiveContainer,
} from "recharts";
const Stats = ({
  status,
  wpm,
  countDown,
  countDownConstant,
  statsCharCount,
  rawKeyStrokes,
}) => {
  const [wpmHistory, setWpmHistory] = useState([0]);

  const data = wpmHistory.map((history, index) => {
    return {
      wpm: history,
      time: index,
    };
  });

  useEffect(() => {
    if (status === "started") {
      setWpmHistory([0]); // Reset history when user starts playing again
    }
  }, [status]);

  useEffect(() => {
    if (status === "started") {
      const roundedWpm = Math.round(wpm);
      const validWpm = isFinite(roundedWpm) ? roundedWpm : 0; // Check if wpm is finite, otherwise use 0
      setWpmHistory((prevWpmHistory) => [...prevWpmHistory, validWpm]);
      console.log(validWpm);
      console.log(wpmHistory);
    }
  }, [countDown]);

  const renderAccuracy = () => (
    <h4>Accuracy: {Math.round(statsCharCount[0])} %</h4>
  );

  const renderCharStats = () => (
    <Tooltip
      title={
        <span style={{ whiteSpace: "pre-line" }}>{CHAR_TOOLTIP_TITLE}</span>
      }
    >
      <h4>
        Char: <span className="correct-char-stats">{statsCharCount[1]}</span>/
        <span className="incorrect-char-stats">{statsCharCount[2]}</span>/
        <span className="missing-char-stats">{statsCharCount[3]}</span>/
        <span className="correct-char-stats">{statsCharCount[4]}</span>/
        <span className="incorrect-char-stats">{statsCharCount[5]}</span>
      </h4>
    </Tooltip>
  );

  const Chart = () => (
    <ResponsiveContainer
      width="100%"
      minHeight={200}
      maxHeight={200}
      height="100%"
    >
      <LineChart
        width="100%"
        height="100%"
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <TooltipChart />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderRawKpm = () => (
    <h4>Raw KPM: {Math.round((rawKeyStrokes / countDownConstant) * 60.0)}</h4>
  );

  return (
    <>
      <h3>{countDown} s</h3>
      {status === "finished" && (
        <div className="stats-overlay">
          <section className="stats-chart">
            <div className="stats-text">
              <h3>WPM: {Math.round(wpm)}</h3>
              {renderAccuracy()}
              {renderCharStats()}
              {renderRawKpm()}
            </div>
            {Chart()}
          </section>
        </div>
      )}
    </>
  );
};

export default Stats;
