import React, { useRef } from "react";
import useSendDataToServer from "../hooks/useSendDataToServer";

function SignUp() {
  const [formData, handleInputChange, handleSubmit, errors, saveAccount] =
    useSendDataToServer(`${process.env.REACT_APP_SERVER_URL}/api/sign-up`);

  const formRef = useRef();
  return (
    <div className="wrapper">
      <div className="form-container">
        <h1 className="title">Sign Up</h1>
        <form onSubmit={handleSubmit} className="form-input" ref={formRef}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="username"
              placeholder="Enter your username!"
              value={formData.username}
              onChange={handleInputChange}
              maxLength="30"
            />
            {errors.length !== 0 &&
              errors.map(
                ({ path, msg }) =>
                  path === "username" && <p className="error-msg">{msg}</p>
              )}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="email"
              placeholder="user@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.length !== 0 &&
              errors.map(
                ({ path, msg }) =>
                  path === "email" && <p className="error-msg">{msg}</p>
              )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.length !== 0 &&
              errors.map(
                ({ path, msg }) =>
                  path === "password" && <p className="error-msg">{msg}</p>
              )}
          </div>
          <section>
            <button>Sign Up</button>
            <p>
              <a className="sign-up-link" href="/login">Login</a>
            </p>
          </section>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
