import React, { Suspense, useEffect, useState } from "react";

const Stats = ({
  status,
  wpm,
  countDown,
  countDownConstant,
  statsCharCount,
  language,
  rawKeyStrokes,
  theme,
  renderResetButton,
  setIncorrectCharsCount,
  incorrectCharsCount,
}) => {
  const [roundedRawWpm, setRoundedRawWpm] = useState(0);
  const [dinamiStatsChart, setDinamicStatsChart] = useState(null);
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

  const data = typingTestHistory.map((history) => ({
    wpm: history.wpm,
    rawWpm: history.rawWpm,
    time: history.time,
    error: history.error,
  }));

  const loadDinamicStatsChart = async () => {
    const module = await import("../../common/StatsChart");
    const StatsChart = module.default;
    setDinamicStatsChart(
      <StatsChart
        accuracy={accuracy}
        countDownConstant={countDownConstant}
        language={language}
        data={data}
        theme={theme}
        rawKeyStrokes={rawKeyStrokes}
        renderResetButton={renderResetButton}
        statsCharCount={statsCharCount}
      />
    );
  };

  useEffect(() => {
    if (status === "started") {
      setTypingTestHistory(initialTypingTestHistory);
    }
    if (status === "finished") {
      loadDinamicStatsChart();
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

  return (
    <>
      {status !== "finished" && (
        <>
          <h3>{countDown} s</h3>
          <h3>WPM: {Math.round(wpm)}</h3>
        </>
      )}

      {status === "finished" && <Suspense>{dinamiStatsChart}</Suspense>}
    </>
  );
};

export default Stats;
