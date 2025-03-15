import { Link } from "react-router-dom";
import React from "react";
import "./settings.css"


const SettingsPage = () => {
  return (
    <div className="settings-container">
      <h2 className="settings-title">User Settings</h2>

      {/* Change Name Section */}
      <div className="settings-card">
        <h3>Change Name</h3>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <button className="save-btn">Save Name</button>
      </div>

      {/* Change Password Section */}
      <div className="settings-card">
        <h3>Change Password</h3>
        <input type="password" placeholder="New Password" />
        <button className="save-btn">Save Password</button>
      </div>

      {/* Change Email Section */}
      <div className="settings-card">
        <h3>Change Email</h3>
        <input type="email" placeholder="Email" />
        <button className="save-btn">Save Email</button>
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
