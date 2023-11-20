import React, {useRef} from "react";
import "../style/login.css";
import useSendDataToServer from '../hooks/useSendDataToServer'

function Login() {
  const [formData, handleInputChange, handleSubmit] = useSendDataToServer("http://localhost:8000/api/login");
  const formRef = useRef()

  return (
    <div className="login-container">
      <h1 className="title">Login</h1>
      <form onSubmit={handleSubmit} className="form-input" ref={formRef}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" className="email" placeholder="user@gmail.com" value={formData.email} onChange={handleInputChange}/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Atleast 8 characters" value={formData.password} onChange={handleInputChange}/>
        </div>
      <section>
        <button>Login</button>
        <p>
          Dont have an account <a href="/sign-up">Sign up</a>
        </p>
      </section>
      </form>
    </div>
  );
}

export default Login;
