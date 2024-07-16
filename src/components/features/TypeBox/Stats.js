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

// 120s
// Increment by 4
// 60s
// Increment by 2
// 30s
// Increment by 1
// 15s
// Increment by 1

const Stats = ({
  status,
  wpm,
  countDown,
  countDownConstant,
  statsCharCount,
  rawKeyStrokes,
  theme,
}) => {
  const [wpmHistory, setWpmHistory] = useState([0]);
  const language = localStorage.getItem("language");

  const data = wpmHistory.map((history, index) => {
    return {
      wpm: history,
      time: index,
    };
  });
  data.shift();

  const primaryStatsTitleStyles = {
    color: theme.textTypeBox,
    marginBlock: 0,
    marginBottom: "6px",
    fontSize: "20px",
  };

  const primaryStatsValueStyles = {
    marginBlock: 0,
    fontSize: "36px",
    color: theme.text,
  };

  const statsTitleStyles = {
    color: theme.textTypeBox,
    marginBlock: 0,
    marginBottom: "6px",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const statsValueStyles = {
    marginBlock: 0,
  };

  const tooltipStyles = {
    fontSize: "12px",
    lineHeight: "6px",
  };

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
    }
  }, [countDown]);

  const renderCharStats = () => (
    <Tooltip
      title={
        <span style={{ whiteSpace: "pre-line" }}>{CHAR_TOOLTIP_TITLE}</span>
      }
    >
      <div>
        <p style={statsTitleStyles}>Characters</p>
        <h2 style={statsValueStyles}>
          <span className="correct-char-stats">{statsCharCount[1]}</span>/
          <span className="incorrect-char-stats">{statsCharCount[2]}</span>/
          <span className="missing-char-stats">{statsCharCount[3]}</span>/
          <span className="correct-char-stats">{statsCharCount[4]}</span>/
          <span className="incorrect-char-stats">{statsCharCount[5]}</span>
        </h2>
      </div>
    </Tooltip>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            paddingInline: "8px",
            paddingBlock: "2px",
          }}
        >
          <p className="label" style={{ fontSize: "14px", fontWeight: "bold" }}>
            {label}
          </p>
          <p
            className="desc"
            style={tooltipStyles}
          >{`Errors: ${statsCharCount[2]}`}</p>
          <p
            className="desc"
            style={tooltipStyles}
          >{`WPM: ${payload[0].value}`}</p>
          <p className="desc" style={tooltipStyles}>{`Raw: ${Math.round(
            (rawKeyStrokes / countDownConstant) * 60.0
          )}`}</p>
        </div>
      );
    }

    return null;
  };

  const renderAccuracy = () => (
    <div style={{ marginTop: "16px" }}>
      <h2 style={primaryStatsTitleStyles}>ACC</h2>
      <h1 style={primaryStatsValueStyles}>
        {" "}
        {Math.round(statsCharCount[0])} %
      </h1>
    </div>
  );

  const renderRawKpm = () => (
    <div>
      <p style={statsTitleStyles}>Raw</p>
      <h2 style={statsValueStyles}>
        {" "}
        {Math.round((rawKeyStrokes / countDownConstant) * 60.0)}
      </h2>
    </div>
  );

  const renderLanguage = () => (
    <div>
      <p style={statsTitleStyles}>Test Mode</p>
      <h2 style={statsValueStyles}>{language}</h2>
    </div>
  );

  const renderTime = () => (
    <div>
      <p style={statsTitleStyles}>Time</p>
      <h2 style={statsValueStyles}>{countDownConstant}s</h2>
    </div>
  );

  const renderWpm = () => (
    <div>
      <h2 style={primaryStatsTitleStyles}>WPM</h2>
      <h1 style={primaryStatsValueStyles}>{Math.round(wpm)}</h1>
    </div>
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
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid stroke={theme.text} opacity={0.15} />
        <XAxis dataKey="time" stroke={theme.text} opacity={0.25} />
        <YAxis stroke={theme.text} opacity={0.25} />
        <TooltipChart content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke={theme.text}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <h3>{countDown} s</h3>
      {status === "finished" && (
        <div className="stats-overlay">
          <section className="stats-chart">
            <section className="stats-header">
              <div>
                {renderWpm()}
                {renderAccuracy()}
              </div>
              {Chart()}
            </section>
            <section className="stats-footer">
              {renderLanguage()}
              {renderRawKpm()}
              {renderCharStats()}
              {renderTime()}
            </section>
          </section>
        </div>
      )}
    </>
  );
};

export default Stats;
