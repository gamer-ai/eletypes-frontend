import React from "react";

function RankingBox() {
  return (
    <div className="RankingBox">
      <h2>Top Ranking</h2>
      <table>
        <caption>
          Category <select name="category" id="category">
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
        <tr>
          <td data-cell="No">1</td>
          <td data-cell="Username">Rendi V.S</td>
          <td data-cell="Email">hardleberg@gmail.com</td>
          <td data-cell="Score">100 WPM</td>
        </tr>
        <tr>
          <td data-cell="No">2</td>
          <td data-cell="Username">Bintang</td>
          <td data-cell="Email">bintang@gmail.com</td>
          <td data-cell="Score">99 WPM</td>
        </tr>
        <tr>
          <td data-cell="No">3</td>
          <td data-cell="Username">Ahmad</td>
          <td data-cell="Email">ahmad@gmail.com</td>
          <td data-cell="Score">98 WPM</td>
        </tr>
        <tr>
          <td data-cell="No">4</td>
          <td data-cell="Username">Fajar</td>
          <td data-cell="Email">fajar@gmail.com</td>
          <td data-cell="Score">97 WPM</td>
        </tr>
        <tr>
          <td data-cell="No">5</td>
          <td data-cell="Username">Toni</td>
          <td data-cell="Email">toni@gmail.com</td>
          <td data-cell="Score">96 WPM</td>
        </tr>
        <tr>
          <td data-cell="No">6</td>
          <td data-cell="Username">Nobita</td>
          <td data-cell="Email">nobita@gmail.com</td>
          <td data-cell="Score">95 WPM</td>
        </tr>
        <tr>
          <td data-cell="No">7</td>
          <td data-cell="Username">James</td>
          <td data-cell="Email">james@gmail.com</td>
          <td data-cell="Score">94 WPM</td>
        </tr>
        <tr>
          <td data-cell="No">8</td>
          <td data-cell="Username">kroos</td>
          <td data-cell="Email">kroos@gmail.com</td>
          <td data-cell="Score">93 WPM</td>
        </tr>
      </table>
    </div>
  );
}

export default RankingBox;
