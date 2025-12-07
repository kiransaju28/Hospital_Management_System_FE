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
import AddVitals from "./Pages/Doctor/BasicVitals/AddVitals";
import EditVitals from "./Pages/Doctor/BasicVitals/EditVitals";
import ViewAppointment from "./Pages/Doctor/ViewAppointment";
import AddConsultation from "./Pages/Doctor/AddConsultation";
import ConsultationHistory from "./Pages/Doctor/ConsultationHistory";
import AddPrescription from "./Pages/Doctor/AddPrescription";
import AddLabTest from "./Pages/Doctor/AddLabTest";
import EditPrescription from "./Pages/Doctor/EditPrescription";
import EditLabTest from "./Pages/Doctor/EditLabTest";
import TestList from "./Pages/Lab Technician/TestList";
import AddTest from "./Pages/Lab Technician/AddTest";
import EditTest from "./Pages/Lab Technician/EditTest";

import DoPrescription from "./Pages/Lab Technician/DoPrescription";
import ViewPrescription from "./Pages/Lab Technician/ViewPrescription";
import AddReport from "./Pages/Lab Technician/AddReport";
import ViewReport from "./Pages/Lab Technician/ViewReport";
import EditReport from "./Pages/Lab Technician/EditReport";

import ReportList from "./Pages/Lab Technician/ReportList";

import MedicineList from "./Pages/Pharmacist/MedicineList";
import AddMedicine from "./Pages/Pharmacist/AddMedicine";
import EditMedicine from "./Pages/Pharmacist/EditMedicine";

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

        {/* Doctor Routes */}
        <Route path="/doctor-dashboard" element={<ViewAppointment />} />
        <Route path="/doctor/consultation-history" element={<ConsultationHistory />} />
        <Route path="/doctor/add-vitals/:appointmentId" element={<AddVitals />} />
        <Route path="/doctor/edit-vitals/:id" element={<EditVitals />} />
        <Route path="/doctor/add-consultation/:appointmentId" element={<AddConsultation />} />
        <Route path="/doctor/add-prescription/:consultationId" element={<AddPrescription />} />
        <Route path="/doctor/add-lab-test/:consultationId" element={<AddLabTest />} />
        <Route path="/doctor/edit-prescription/:id" element={<EditPrescription />} />
        <Route path="/doctor/edit-lab-test/:id" element={<EditLabTest />} />

        {/* Lab Technician Routes */}
        <Route path="/lab-tests" element={<TestList />} />
        <Route path="/add-test" element={<AddTest />} />
        <Route path="/edit-test/:id" element={<EditTest />} />
        <Route path="/lab-test-orders" element={<DoPrescription />} />
        <Route path="/view-prescription/:id" element={<ViewPrescription />} />
        <Route path="/add-report/:orderId" element={<AddReport />} />
        <Route path="/view-report/:id" element={<ViewReport />} />
        <Route path="/edit-report/:id" element={<EditReport />} />
        <Route path="/lab-reports" element={<ReportList />} />

        {/* Pharmacist Routes */}
        <Route path="/medicines" element={<MedicineList />} />
        <Route path="/add-medicine" element={<AddMedicine />} />
        <Route path="/edit-medicine/:id" element={<EditMedicine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
