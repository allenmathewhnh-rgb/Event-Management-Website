import React, { useState } from "react";
import "./Login.css";

const Login = ({ onSwitchToRegister, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (
      storedUser &&
      username === storedUser.username &&
      password === storedUser.password
    ) {
      alert("Login successful");
      onClose();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-card">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-btn">Login</button>
      </form>
      <hr />
      <p className="register-link">
        Don't have an account?{" "}
        <span onClick={onSwitchToRegister}>Register here</span>
      </p>
    </div>
  );
};

export default Login;