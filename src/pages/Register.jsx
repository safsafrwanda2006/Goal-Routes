import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

function Register() {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("https://goal-routes-backend.onrender.com/register", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          localStorage.setItem("userId", res.data.userId);
          navigate("/taskspage");
        } else {
           console.log(res);
           alert(res.data.Error || "Registration Failed");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="pageContainer">
      <div className="login-header">
        <Link  className="back-btn" to="/">
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
          <h2>Sign up</h2>
        </label>
        <div className="name-register">
          <input
            type="text"
            placeholder="First Name"
            onChange={(e) =>
              setValues({ ...values, firstname: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            onChange={(e) => setValues({ ...values, lastname: e.target.value })}
          />
        </div>
        <input
          type="email"
          placeholder="Email..."
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />
        <button>Sign up</button>
        <p>
          Alredy have an account <Link to="/login"> Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
