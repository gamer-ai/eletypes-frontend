import React, { useEffect } from "react";

function Profile() {
  return (
    <>
      <div className="profile-container">
        <section className="personal-info">
          <figure className="user-profile-image">
            {/* <img
              src="https://cdn1.iconfinder.com/data/icons/instagram-ui-glyph/48/Sed-09-1024.png"
              alt="profile"
            /> */}
          </figure>
          <h2>Rendi Virgantara Setiawan</h2>
          <h4>rendi@gmail.com</h4>
        </section>
        <section className="scores">
          {/* <div className="90-seconds"></div>
          <div className="60-seconds"></div>
          <div className="30-seconds"></div>
          <div className="15-seconds"></div> */}
        </section>
      </div>
    </>
  );
}

export default Profile;
