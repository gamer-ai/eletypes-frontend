import React from "react";
import "../style/login.css"

function Login() {
  return (
    <div className="login-container">
      <h1 className="title">Login</h1>
      <form action="/" className="form-input">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" 
                 name="email"
                 id="email"
                 className="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
            <input type="password" 
                   name="password" 
                   id="password" />
        </div>
      </form>
      <section>
        <button>Login</button>
        <p>
          Dont have an account <a href="/sign-up">Sign up</a>
        </p>
      </section>
    </div>
  );
}

export default Login;
