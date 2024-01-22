import React, { useEffect, useRef, useState } from "react";
import useSendDataToServer from "../hooks/useSendDataToServer";

function Login() {
  const [formData, handleInputChange, handleSubmit, errors] =
    useSendDataToServer(`${process.env.REACT_APP_SERVER_URL}/api/login`);

  const formRef = useRef();

  return (
    <div className="wrapper">
      <div className="form-container">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit} className="form-input" ref={formRef}>
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
            <button>Login</button>
            <p>
              <a className="login-link" href="/sign-up">Sign up</a>
            </p>
          </section>
        </form>
      </div>
    </div>
  );
}

export default Login;
