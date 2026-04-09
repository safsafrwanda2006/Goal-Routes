import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8080/login", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          localStorage.setItem("userId", res.data.userId);
          navigate("/taskspage");
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="pageContainer">
      <div className="login-header">
        <Link className="back-btn" to="/">
          <img src="/back.png" alt="" />
        </Link>

        <div>
          <Link className="logo-login" to="/">
            <h1>G</h1>
            <img src="rising.png" alt="" />
            <h1>R</h1>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} action="submit">
        <label htmlFor="">
          <h2>Sign in</h2>
        </label>
        <input
          type="email"
          placeholder="Email..."
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <button>Sign in</button>
        <p>
          Don't have an account <Link to="/register"> Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
