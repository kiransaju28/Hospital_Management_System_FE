// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import Dashboard from "./Pages/Admin/Dashboard/Admindashboard";
import AddDoctor from "./Pages/Admin/AddDoctor";
import AddStaff from "./Pages/Admin/AddStaff";
import DoctorList from "./Pages/Admin/DoctorList";
import StaffList from "./Pages/Admin/StaffList";
import EditDoctor from "./Pages/Admin/EditDoctor";
import EditStaff from "./Pages/Admin/EditStaff";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* admin dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/edit-doctor/:id" element={<EditDoctor />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/edit-staff/:id" element={<EditStaff />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;