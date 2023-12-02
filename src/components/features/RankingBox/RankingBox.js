import React, { useState } from "react";
import useGetDataFromServer from "../../../hooks/useGetDataFromServer";

function RankingBox() {
  const users = useGetDataFromServer(
    [],
    `${process.env.REACT_APP_SERVER_URL}/ranking`,
    "ranking"
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

              .map((user, index) => (
                <tr key={user._id}>
                  <td data-cell="No">{index + 1}</td>
                  <td data-cell="Username">{user.username}</td>
                  <td data-cell="Email">{user.email}</td>
                  <td data-cell="Score">{user.ninetySeconds.score || 0}</td>
                </tr>
              ))}
          {selectedCategory === "60-seconds" &&
            users
              .sort((a, b) => b.sixtySeconds.score - a.sixtySeconds.score)

              .map((user, index) => (
                <tr key={user._id}>
                  <td data-cell="No">{index + 1}</td>
                  <td data-cell="Username">{user.username}</td>
                  <td data-cell="Email">{user.email}</td>
                  <td data-cell="Score">{user.sixtySeconds.score || 0}</td>
                </tr>
              ))}
          {selectedCategory === "30-seconds" &&
            users
              .sort((a, b) => b.thirtySeconds.score - a.thirtySeconds.score)

              .map((user, index) => (
                <tr key={user._id}>
                  <td data-cell="No">{index + 1}</td>
                  <td data-cell="Username">{user.username}</td>
                  <td data-cell="Email">{user.email}</td>
                  <td data-cell="Score">{user.thirtySeconds.score || 0}</td>
                </tr>
              ))}
          {selectedCategory === "15-seconds" &&
            users
              .sort((a, b) => b.fifteenSeconds.score - a.fifteenSeconds.score)

              .map((user, index) => (
                <tr key={user._id}>
                  <td data-cell="No">{index + 1}</td>
                  <td data-cell="Username">{user.username}</td>
                  <td data-cell="Email">{user.email}</td>
                  <td data-cell="Score">{user.fifteenSeconds.score || 0}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

export default RankingBox;
