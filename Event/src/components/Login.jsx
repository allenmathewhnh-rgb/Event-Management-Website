import React, { useState } from "react";
import { getUsers, LOGGED_IN_USER_KEY } from '../utils/storage'
import "./Login.css";

const Login = ({ onSwitchToRegister, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const users = getUsers()
    const storedUser = users.find(
      (user) => user.username === username || user.email === username,
    )

    if (storedUser && password === storedUser.password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', storedUser.username);
      const accountKey = (storedUser.email || storedUser.username || '')
        .toString()
        .trim()
        .toLowerCase()
      if (accountKey) localStorage.setItem(LOGGED_IN_USER_KEY, accountKey)
      alert("Login successful");
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(storedUser);
      }
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