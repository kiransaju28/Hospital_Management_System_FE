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
import PatientList from "./Pages/Receptionist/PatientList";
import AddPatient from "./Pages/Receptionist/AddPatient";
import EditPatient from "./Pages/Receptionist/EditPatient";
import AppointmentList from "./Pages/Receptionist/AppointmentList";
import AddAppointment from "./Pages/Receptionist/AddAppointment";
import EditAppointment from "./Pages/Receptionist/EditAppointment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* admin dashboard */}
        <Route path="/admindashboard" element={<Dashboard />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/edit-doctor/:id" element={<EditDoctor />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/edit-staff/:id" element={<EditStaff />} />

        {/* Receptionist Routes */}
        <Route path="/patients" element={<PatientList />} />
        <Route path="/add-patient" element={<AddPatient />} />
        <Route path="/edit-patient/:id" element={<EditPatient />} />
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/add-appointment" element={<AddAppointment />} />
        <Route path="/edit-appointment/:id" element={<EditAppointment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;