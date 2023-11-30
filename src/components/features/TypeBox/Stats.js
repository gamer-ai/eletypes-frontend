import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import { CHAR_TOOLTIP_TITLE } from "../../../constants/Constants";
import axios from "axios";
import { useCookies } from "react-cookie";

const Stats = ({
  status,
  wpm,
  countDown,
  countDownConstant,
  statsCharCount,
  rawKeyStrokes,
}) => {
  const [cookies, setCookie] = useCookies();
  const token = cookies.token;
  const scoreRef = useRef();

  const sendScoreToServer = async (score) => {
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/ranking`, {
        time: countDownConstant,
        score: parseInt(score),
        token,
      });

      console.log("Successfull post WPM to server!");
    } catch (err) {
      console.log("Error sending data to server!");
    }
  };

  useEffect(() => {
    if (scoreRef.current) {
      sendScoreToServer(scoreRef.current.innerText);
    }
  }, [countDown]);

  return (
    <>
      <h3>{countDown} s </h3>
      <Box display="flex" flexDirection="row">
        <h3>WPM: {Math.round(wpm)}</h3>
        {status === "finished" && (
          <h4>Accuracy: {Math.round(statsCharCount[0])} %</h4>
        )}
        {status === "finished" && (
          <Tooltip
            title={
              <span style={{ whiteSpace: "pre-line" }}>
                {CHAR_TOOLTIP_TITLE}
              </span>
            }
          >
            <h4>
              Char:{" "}
              <span className="correct-char-stats" ref={scoreRef}>
                {statsCharCount[1]}
              </span>
              /<span className="incorrect-char-stats">{statsCharCount[2]}</span>
              /<span className="missing-char-stats">{statsCharCount[3]}</span>/
              <span className="correct-char-stats">{statsCharCount[4]}</span>/
              <span className="incorrect-char-stats">{statsCharCount[5]}</span>
            </h4>
          </Tooltip>
        )}
        {status === "finished" && (
          <h4>
            Raw KPM: {Math.round((rawKeyStrokes / countDownConstant) * 60.0)}
          </h4>
        )}
      </Box>
    </>
  );
};

export default Stats;
