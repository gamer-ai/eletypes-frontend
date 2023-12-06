import React, { useEffect } from "react";
import useGetDataFromServer from "../hooks/useGetDataFromServer";

function Profile() {
  const data = useGetDataFromServer(
    {},
    `${process.env.REACT_APP_SERVER_URL}/user-profile`,
    "user-profile-detail"
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (Object.keys(data).length !== 0) {
    return (
      <>
        <div className="canvas user-profile">
          <div className="profile-container">
            <section className="personal-info">
              <figure className="user-image">
                <img
                  src="https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-09-1024.png"
                  alt="profile"
                />
              </figure>
              <div className="info">
                <h2>{data.username}</h2>
                <h4>{data.email}</h4>
              </div>
            </section>
            <section className="scores">
              <h3>Total Scores</h3>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <td>90 Seconds</td>
                    <td>60 Seconds</td>
                    <td>30 Seconds</td>
                    <td>15 Seconds</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Score</th>
                    <td data-cell="90-seconds">{data.ninetySeconds.score}</td>
                    <td data-cell="60-seconds">{data.sixtySeconds.score}</td>
                    <td data-cell="30-seconds">{data.thirtySeconds.score}</td>
                    <td data-cell="15-seconds">{data.fifteenSeconds.score}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
