import React, { useEffect, useState } from "react";
import useGetDataFromServer from "../../../hooks/useGetDataFromServer";

function RankingBox() {
  const users = useGetDataFromServer(
    [],
    `${process.env.REACT_APP_SERVER_URL}/ranking`
  );
  const [selectedCategory, setSelectedCategory] = useState("90-seconds");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="RankingBox">
      <h2>Top Ranking</h2>
      <table>
        <caption>
          Category
          <select name="category" id="category" onChange={handleCategoryChange}>
            <option value="90-seconds">90 S</option>
            <option value="60-seconds">60 S</option>
            <option value="30-seconds">30 S</option>
            <option value="15-seconds">15 S</option>
          </select>
        </caption>
        <tr>
          <th>No</th>
          <th>Username</th>
          <th>Email</th>
          <th>Score</th>
        </tr>
        {selectedCategory === "90-seconds" &&
           users
            .sort((a, b) => b.ninetySeconds.wpm - a.ninetySeconds.wpm)

            .map((user, index) => (
              <tr>
                <td data-cell="No">{index + 1}</td>
                <td data-cell="Username">{user.username}</td>
                <td data-cell="Email">{user.email}</td>
                <td data-cell="Score">{user.ninetySeconds.wpm || 0} WPM</td>
              </tr>
            ))}
      </table>
    </div>
  );
}

export default RankingBox;
