// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/login"; // Ensure filename matches (Login.jsx vs login.jsx)
import AdminDashboard from "./Pages/Admin/Dashboard/Adminashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;