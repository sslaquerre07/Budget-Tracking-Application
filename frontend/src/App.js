import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Import Router components
import Dashboard from "./routes/dashboard/Dashboard";
import Home from "./routes/home/Home"; 
import SettingsPage from "./routes/settings/SettingsPage"; // ✅ Import Settings Page

function App() {
  return (
    <Router> {}
      <Routes> 
        <Route path="/" element={<Dashboard />} /> {/* Default route for Dashboard */}
        <Route path="/" element={<SettingsPage />} /> {/* Route for Settings Page */}
        <Route path="/" element={<Home />} /> {}
      </Routes>
    </Router>
  );
}

export default App;
