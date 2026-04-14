import React, { useState } from "react";
import { getUsers, saveUsers } from '../utils/storage'
import { apiUrl } from '../utils/api'
import "./Register.css";

const Register = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      alert('Please fill in username, email, phone, and password.')
      return
    }
    if (password.length < 4) {
      alert('Password must be at least 4 characters long.')
      return
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    try {
      const res = await fetch(apiUrl("/accounts/register/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          email: email.trim(),
          phone: phone.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed.")
        return
      }

      const savedUser = data.user || {
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        name: `${firstName} ${lastName}`.trim() || username.trim(),
      }

      const existingUsers = getUsers()
      const nextUsers = [
        ...existingUsers.filter(
          (user) =>
            user.username !== savedUser.username &&
            (user.email || '').toLowerCase() !== (savedUser.email || '').toLowerCase(),
        ),
        savedUser,
      ]
      saveUsers(nextUsers)

      alert("Registration successful! Please login.");
      onSwitchToLogin();
    } catch (error) {
      console.error(error);
      alert("Could not connect to the server.")
    }
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
