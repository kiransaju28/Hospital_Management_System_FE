import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import Dashboard from "./Pages/Dashboard/dashboard";
import AddDoctor from "./Pages/Admin/AddDoctor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* admin dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
