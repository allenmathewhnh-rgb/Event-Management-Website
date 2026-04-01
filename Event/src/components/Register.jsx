import React, { useState } from "react";
import { getUsers, saveUsers } from '../utils/storage'
import "./Register.css";

const Register = ({ onSwitchToLogin, onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      alert('Please fill in username, email, phone, and password.')
      return
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters long.')
      return
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    const users = getUsers()
    const duplicate = users.find((user) => user.username === username || user.email === email)
    if (duplicate) {
      alert('A user with that username or email already exists.')
      return
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim() || username,
      role: 'Customer',
      phone,
      blocked: false,
      password,
    }

    saveUsers([...users, newUser])
    alert("Registration successful! Please login.");
    onSwitchToLogin();
  };

  return (
    <div className="register-card">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
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
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-group">
            <label>Phone</label>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <p className="password-note">
          Your password must be at least 8 characters long and contain letters and numbers.
        </p>
        <button type="submit" className="register-btn">Register</button>
      </form>
      <p className="login-link">
        Already have an account?{" "}
        <span onClick={onSwitchToLogin}>Login here</span>
      </p>
    </div>
  );
};

export default Register;