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
  currCharIncorrectCount,
}) => {
  const initialTypingTestHistory = [
    {
      error: 0,
      wpm: 0,
      raw: 0,
    },
  ];

  const [typingTestHistory, setTypingTestHistory] = useState(
    initialTypingTestHistory
  );

  const language = localStorage.getItem("language");

  const accuracy = Math.round(statsCharCount[0]);
  const roundedRawKpm = Math.round((rawKeyStrokes / countDownConstant) * 60.0);
  const roundedWpm = Math.round(wpm);

  const data = typingTestHistory.map((history, index) => {
    return {
      error: history.error,
      wpm: history.wpm,
      raw: history.raw,
      time: index + 1,
    };
  });

  useEffect(() => {
    // Reset history when user starts playing again
    if (status === "started") {
      setTypingTestHistory(initialTypingTestHistory);
    }
  }, [status]);

  useEffect(() => {
    if (status === "started" && countDown < countDownConstant - 1) {
      // const validWpm = isFinite(roundedWpm) ? roundedWpm : 0; // Check if wpm is finite, otherwise use 0
      // setErrorsHistory((prevErrorsHistory) => [
      //   ...prevErrorsHistory,
      //   statsCharCount[2],
      // ]);
      // setWpmHistory((prevWpmHistory) => [...prevWpmHistory, validWpm]);
      // setRawHistory((prevRawHistory) => [...prevRawHistory, roundedRawKpm]);

      setTypingTestHistory((prevTypingTestHistory) => [
        ...prevTypingTestHistory,
        {
          error: currCharIncorrectCount,
          wpm: roundedWpm,
          raw: roundedRawKpm,
        },
      ]);
    }
  }, [countDown]);

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
      console.log(payload[0].payload.error);
      const payloadData = payload[0].payload;
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
          >{`Errors: ${payloadData.error}`}</p>
          <p
            className="desc"
            style={tooltipStyles}
          >{`WPM: ${payloadData.wpm}`}</p>
          <p
            className="desc"
            style={tooltipStyles}
          >{`Raw: ${payloadData.raw}`}</p>
        </div>
      );
    }

    return null;
  };

  const renderAccuracy = () => (
    <div style={{ marginTop: "16px" }}>
      <h2 style={primaryStatsTitleStyles}>ACC</h2>
      <h1 style={primaryStatsValueStyles}>{accuracy} %</h1>
    </div>
  );

  const renderRawKpm = () => (
    <div>
      <p style={statsTitleStyles}>Raw</p>
      <h2 style={statsValueStyles}>{roundedRawKpm}</h2>
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
      <h1 style={primaryStatsValueStyles}>{roundedWpm}</h1>
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
