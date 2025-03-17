import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./settings.css";

const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Function to update the password
  const handlePasswordChange = async () => {
    if (!email || !newPassword) {
      setMessage("Email and password cannot be empty!");
      return; // Stop execution if fields are empty
    }

    try {
      const response = await fetch("http://localhost:8080/user/updatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }), // ✅ Ensure correct key name
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        setMessage("Password updated successfully!");
      } else {
        setMessage(`Error: ${data.response || "Failed to update password"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("Network error: Could not connect to the server");
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">User Settings</h2>

      {/* Change Password Section */}
      <div className="settings-card">
        <h3>Change Password</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="save-btn" onClick={handlePasswordChange}>
          Save Password
        </button>
        {message && <p className="message">{message}</p>}
      </div>

     

     

      {/* Danger Zone */}
      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <p>Permanently delete your account. This action cannot be undone.</p>
        <button className="delete-btn">Delete Account</button>
      </div>
    </div>
  );
};

export default SettingsPage;
