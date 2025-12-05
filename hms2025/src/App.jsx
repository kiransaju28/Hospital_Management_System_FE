import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import Dashboard from "./Pages/Dashboard/dashboard";
import AddDoctor from "./Pages/Admin/AddDoctor";
import AddStaff from "./Pages/Admin/AddStaff";

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
        <Route path="/add-staff" element={<AddStaff />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
