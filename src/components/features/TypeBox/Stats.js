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
  theme,
  renderResetButton,
  currCharIncorrectCount,
}) => {
  const initialTypingTestHistory = [
    {
      wpm: 0,
      kpm: 0,
      time: 1, // Start time from 1
    },
  ];

  const [typingTestHistory, setTypingTestHistory] = useState(
    initialTypingTestHistory
  );

  const language = localStorage.getItem("language");

  const accuracy = Math.round(statsCharCount[0]);
  const roundedRawWpm = Math.round(
    (rawKeyStrokes / 5 / (countDownConstant - countDown)) * 60.0
  );
  const roundedWpm = Math.round(wpm);

  const data = typingTestHistory.map((history) => {
    return {
      wpm: history.wpm,
      kpm: history.kpm,
      time: history.time, // Use the time property from history
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
      let shouldRecord = false;
      let increment = 1;

      switch (countDownConstant) {
        case 90:
          shouldRecord = countDown % 4 === 3;
          increment = 4;
          break;
        case 60:
          shouldRecord = countDown % 2 === 1;
          increment = 2;
          break;
        case 30:
        case 15:
          shouldRecord = true;
          increment = 1;
          break;
        default:
          shouldRecord = true;
          increment = 1;
      }

      if (shouldRecord) {
        const newTime = 1 + typingTestHistory.length * increment;

        setTypingTestHistory((prevTypingTestHistory) => [
          ...prevTypingTestHistory,
          {
            wpm: roundedWpm,
            kpm: roundedRawWpm,
            time: newTime,
          },
        ]);
      }
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
    fontSize: "14px",
    lineHeight: "6px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const getFormattedLanguageLanguageName = (value) => {
    switch (value) {
      case "ENGLISH_MODE":
        return "Eng";
      case "CHINESE_MODE":
        return "Chn";
      default:
        return "Eng";
    }
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

  const renderIndicator = (color) => {
    return (
      <div
        style={{ backgroundColor: color, height: "12px", width: "24px" }}
      ></div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const payloadData = payload[0].payload;
      return (
        <div
          className="custom-tooltip"
          style={{
            paddingInline: "8px",
            paddingBlock: "2px",
          }}
        >
          <p className="label" style={{ fontSize: "12px", fontWeight: "bold" }}>
            {label}
          </p>
          <p className="desc" style={tooltipStyles}>
            {renderIndicator(theme.text)}
            {`WPM: ${payloadData.wpm}`}
          </p>
          <p className="desc" style={tooltipStyles}>
            {renderIndicator(theme.textTypeBox)}
            {`KPM: ${payloadData.kpm}`}
          </p>
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
      <p style={statsTitleStyles}>KPM</p>
      <h2 style={statsValueStyles}>{roundedRawWpm}</h2>
    </div>
  );

  const renderLanguage = () => (
    <div>
      <p style={statsTitleStyles}>Test Mode</p>
      <h2 style={statsValueStyles}>
        {getFormattedLanguageLanguageName(language)}
      </h2>
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
          top: 12,
          right: 12,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid
          vertical={false}
          horizontal={false}
          stroke={theme.text}
          opacity={0.15}
        />
        <XAxis
          dataKey="time"
          stroke={theme.text}
          tickMargin={10}
          opacity={0.25}
        />
        <YAxis stroke={theme.text} tickMargin={10} opacity={0.25} />
        <TooltipChart cursor={false} content={<CustomTooltip />} />{" "}
        <Line
          type="monotone"
          dataKey="wpm"
          stroke={theme.text}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="kpm"
          stroke={theme.textTypeBox}
          activeDot={{ r: 6 }}
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
            <section>{renderResetButton()}</section>
          </section>
        </div>
      )}
    </>
  );
};

export default Stats;
