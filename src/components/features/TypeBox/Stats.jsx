import React, { useEffect, useState, useMemo, useRef } from "react";
import { Tooltip } from "@mui/material";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as TooltipChart,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts";
import { red } from "@mui/material/colors";
import Leaderboard from "../Leaderboard/Leaderboard";
import { addScore } from "../../../services/scoreHistory";
import { evaluateBadges } from "../../../services/badges";
import { useLocale } from "../../../context/LocaleContext";
const Stats = ({
  status,
  wpm,
  countDown,
  countDownConstant,
  statsCharCount,
  language,
  rawKeyStrokes,
  wpmKeyStrokes,
  theme,
  renderResetButton,
  setIncorrectCharsCount,
  incorrectCharsCount,
  difficulty,
  numberAddon,
  symbolAddon,
  sessionSeed,
  isCustomMode,
  customListName,
}) => {
  const { t } = useLocale();
  const statsRef = useRef(null);
  const [roundedRawWpm, setRoundedRawWpm] = useState(0);
  const roundedWpm = Math.round(wpm);

  useEffect(() => {
    const worker = new Worker(
      new URL("../../../worker/calculateRawWpmWorker", import.meta.url)
    );

    worker.postMessage({ rawKeyStrokes, countDownConstant, countDown });

    worker.onmessage = function (e) {
      setRoundedRawWpm(e.data);
      worker.terminate();
    };

    return () => worker.terminate();
  }, [rawKeyStrokes, countDownConstant, countDown]);

  const initialTypingTestHistory = [
    {
      wpm: 0,
      rawWpm: 0,
      time: 0,
      error: 0,
    },
  ];

  const [typingTestHistory, setTypingTestHistory] = useState(
    initialTypingTestHistory
  );

  const accuracy = Math.round(statsCharCount[0]);

  // Anti-cheat: the canonical WPM at end-of-test is derived from validated
  // correct characters, not from averaging per-tick rolling snapshots. The
  // old "mean of data[i].wpm" path was exploitable — a key-mash burst
  // inflated early-tick samples, and even though wpmKeyStrokes was
  // backspace-decremented (b540f56), the historical chart array kept the
  // spike forever, so the submitted average stayed inflated. Correct-char
  // count comes from history{} which only marks a char true after a real
  // compare in getCharClassName, so mash+backspace contributes nothing.
  // This anti-cheat method is inconsistent with the leaderboard stats
  // calculation, so revert to the old version. Monkeytype also counts
  // space keystrokes toward WPM.
  const finalWpm =
    (wpmKeyStrokes / 5) * (60 / Math.max(countDownConstant, 1));

  const data = typingTestHistory.map((history) => ({
    wpm: history.wpm,
    rawWpm: history.rawWpm,
    time: history.time,
    error: history.error,
  }));

  useEffect(() => {
    if (status === "started") {
      setTypingTestHistory(initialTypingTestHistory);
    }
  }, [status]);

  useEffect(() => {
    if (status === "started" && countDown < countDownConstant) {
      const worker = new Worker(
        new URL("../../../worker/trackHistoryWorker", import.meta.url)
      );

      worker.postMessage({
        countDown,
        countDownConstant,
        typingTestHistory,
        roundedWpm,
        roundedRawWpm,
        incorrectCharsCount,
      });

      worker.onmessage = function (e) {
        const { newEntry, resetErrors } = e.data;
        setTypingTestHistory((prevTypingTestHistory) => [
          ...prevTypingTestHistory,
          newEntry,
        ]);

        if (resetErrors) {
          setIncorrectCharsCount(0);
        }
      };

      // Clean up the worker on component unmount
      return () => worker.terminate();
    }
  }, [countDown]);

  const modeParams = useMemo(
    () => ({
      language,
      difficulty,
      duration: countDownConstant,
      numberAddon,
      symbolAddon,
    }),
    [language, difficulty, countDownConstant, numberAddon, symbolAddon]
  );

  // Save score to local history and evaluate badges when session finishes
  const [historySaved, setHistorySaved] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  useEffect(() => {
    if (status === "finished" && !historySaved) {
      // Custom-words runs aren't recorded: scores depend on the user's chosen
      // words so they aren't comparable to random-mode history/badges/etc.
      // Leaderboard submission is also blocked downstream in Leaderboard.jsx.
      if (finalWpm > 0 && !isCustomMode) {
        addScore({ wpm: finalWpm, accuracy, ...modeParams });
        const earned = evaluateBadges({ wpm: finalWpm, accuracy, ...modeParams });
        if (earned.length > 0) {
          setNewBadges(earned);
        }
        window.dispatchEvent(new Event("eletypes-score-updated"));
      }
      setHistorySaved(true);
    }
    if (status === "started") {
      setHistorySaved(false);
      setNewBadges([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const getFormattedLanguageLanguageName = (value) => {
    switch (value) {
      case "ENGLISH_MODE":
        return "eng";
      case "CHINESE_MODE":
        return "chn";
      default:
        return "eng";
    }
  };

  const renderCharStats = () => (
    <Tooltip
      title={
        <span style={{ whiteSpace: "pre-line" }}>{t("char_tooltip")}</span>
      }
    >
      <div>
        <p className="stats-title">{t("characters_label")}</p>
        <h2 className="stats-value">
          <span className="correct-char-stats">{statsCharCount[1]}</span>/
          <span className="incorrect-char-stats">{statsCharCount[2]}</span>/
          <span className="missing-char-stats">{statsCharCount[3]}</span>/
          <span className="correct-char-stats">{statsCharCount[4]}</span>/
          <span className="incorrect-char-stats">{statsCharCount[5]}</span>
        </h2>
      </div>
    </Tooltip>
  );

  const renderIndicator = (color) => (
    <span
      style={{ backgroundColor: color, height: "12px", width: "24px" }}
    ></span>
  );

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
            {`Time: ${label} s`}
          </p>
          <p className="desc tooltip">
            {renderIndicator(red[400])}
            {`${t("errors_label")}: ${payloadData.error}`}
          </p>
          <p className="desc tooltip">
            {renderIndicator(theme.textTypeBox)}
            {`${t("raw_wpm_label")}: ${payloadData.rawWpm}`}
          </p>
          <p className="desc tooltip">
            {renderIndicator(theme.text)}
            {`${t("wpm_label")}: ${payloadData.wpm}`}
          </p>
        </div>
      );
    }

    return null;
  };

  const renderAccuracy = () => (
    <div style={{ marginTop: "16px" }}>
      <h2 className="primary-stats-title">{t("acc_label")}</h2>
      <h1 className="primary-stats-value">{accuracy}%</h1>
    </div>
  );

  const renderRawKpm = () => (
    <div>
      <p className="stats-title">{t("kpm_label")}</p>
      <h2 className="stats-value">
        {Math.round((rawKeyStrokes / Math.max(countDownConstant, 1)) * 60.0)}
      </h2>
    </div>
  );

  const renderLanguage = () => (
    <div>
      <p className="stats-title">{t("test_mode_label")}</p>
      <h2 className="stats-value">
        {getFormattedLanguageLanguageName(language)}
      </h2>
    </div>
  );

  const renderTime = () => (
    <div>
      <p className="stats-title">{t("time_label")}</p>
      <h2 className="stats-value">{countDownConstant} s</h2>
    </div>
  );

  const renderWpm = () => {
    return (
      <div>
        <h2 className="primary-stats-title">{t("wpm_label")}</h2>
        <h1 className="primary-stats-value">{Math.round(finalWpm)}</h1>
      </div>
    );
  };

  const chartData = useMemo(() => data.filter((d) => d.time !== 0), [data]);

  const Chart = useMemo(() => (
    <ResponsiveContainer
      width="100%"
      minHeight={200}
      maxHeight={200}
      height="100%"
    >
      <ComposedChart
        width="100%"
        height="100%"
        data={chartData}
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
        <TooltipChart cursor content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="rawWpm"
          stroke={theme.textTypeBox}
          dot={false}
          activeDot={false}
        />
        <Line
          type="monotone"
          dataKey="wpm"
          stroke={theme.text}
          dot={false}
          activeDot={false}
        />
        <Bar dataKey="error" barSize={12} fill={`${red[400]}`} />
      </ComposedChart>
    </ResponsiveContainer>
  ), [chartData, theme.text, theme.textTypeBox]);

  return (
    <>
      {status !== "finished" && (
        <>
          <h3>{countDown} s</h3>
          <h3>{t("wpm_label")}: {Math.round(wpm)}</h3>
        </>
      )}

      {status === "finished" && (
        <div className="stats-overlay">
          <section className="stats-chart">
            <div ref={statsRef} style={{ background: theme.background, padding: "16px", borderRadius: "8px" }}>
              <section className="stats-header">
                <div>
                  {renderWpm()}
                  {renderAccuracy()}
                </div>
                {Chart}
              </section>
              <section className="stats-footer">
                {renderLanguage()}
                {renderRawKpm()}
                {renderCharStats()}
                {renderTime()}
              </section>
            </div>
            <section>{renderResetButton()}</section>
            {newBadges.length > 0 && (
              <div className="badge-notification">
                <span className="badge-notification-label">
                  {t("badge_unlocked")}
                </span>
                <div className="badge-notification-list">
                  {newBadges.map((b) => (
                    <span key={b.id} className="badge-notification-item">
                      {b.icon} {t(b.nameKey)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Leaderboard
              wpm={Math.round(finalWpm)}
              accuracy={accuracy}
              language={language}
              difficulty={difficulty}
              duration={countDownConstant}
              numberAddon={numberAddon}
              symbolAddon={symbolAddon}
              theme={theme}
              statsRef={statsRef}
              sessionSeed={sessionSeed}
              isCustomMode={isCustomMode}
              customListName={customListName}
            />
          </section>
        </div>
      )}
    </>
  );
};

export default Stats;
