import React, { useState, useRef } from "react";
import useGetDataFromServer from "../../../hooks/useGetDataFromServer";
import useLocalPersistState from "../../../hooks/useLocalPersistState";
import { useNavigate } from "react-router-dom";

function RankingBox() {
  const users = useGetDataFromServer(
    [],
    `${process.env.REACT_APP_SERVER_URL}/ranking`,
    "ranking"
  );
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("90-seconds");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleClick = (id) => {
    window.localStorage.setItem(
      "selected-user-id",
      JSON.stringify(id)
    );

    navigate("/profile");
  };

  const renderRanking = (index, user, category) => {
    return (
      <tr key={user._id}>
        <td data-cell="No">{index + 1}.</td>
        <td data-cell="Username">{user.username}</td>
        <td data-cell="Email"className="email" onClick={() => handleClick(user._id)}>
          {user.email}
        </td>
        <td data-cell="Score">{user[category].score || 0}</td>
      </tr>
    );
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
        <thead>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Email</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {selectedCategory === "90-seconds" &&
            users
              .sort((a, b) => b.ninetySeconds.score - a.ninetySeconds.score)

              .map((user, index) => renderRanking(index, user, "ninetySeconds"))}
          {selectedCategory === "60-seconds" &&
            users
              .sort((a, b) => b.sixtySeconds.score - a.sixtySeconds.score)

              .map((user, index) => renderRanking(index, user, "sixtySeconds"))}
          {selectedCategory === "30-seconds" &&
            users
              .sort((a, b) => b.thirtySeconds.score - a.thirtySeconds.score)

              .map((user, index) => renderRanking(index, user, "thirtySeconds"))}
          {selectedCategory === "15-seconds" &&
            users
              .sort((a, b) => b.fifteenSeconds.score - a.fifteenSeconds.score)

              .map((user, index) => renderRanking(index, user, "fifteenSeconds"))}
        </tbody>
      </table>
    </div>
  );
}

export default RankingBox;
