import React, { useState } from "react";
import { getUsers, saveUsers } from '../utils/storage'
import { apiUrl, API_BASE_URL } from '../utils/api'
import "./Login.css";

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(apiUrl("/accounts/login/"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          password
        })
      });

      const raw = await res.text();
      let data = {}
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        data = {}
      }

      if (!res.ok) {
        alert(data.error || `Login failed (${res.status}).`)
        return
      }

      const loggedInUser = data.user || { username: username.trim() }
      const existingUsers = getUsers()
      const nextUsers = [
        ...existingUsers.filter(
          (user) =>
            user.username !== loggedInUser.username &&
            (user.email || '').toLowerCase() !== (loggedInUser.email || '').toLowerCase(),
        ),
        {
          ...loggedInUser,
          name:
            loggedInUser.name ||
            `${loggedInUser.first_name || ''} ${loggedInUser.last_name || ''}`.trim() ||
            loggedInUser.username,
        },
      ]
      saveUsers(nextUsers)
      onLoginSuccess?.(loggedInUser)
      window.location.href = "/user";
    } catch (error) {
      console.error(error);
      alert(`Could not connect to the Django server at ${API_BASE_URL}.`)
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
        <button type="submit">Login</button>
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
