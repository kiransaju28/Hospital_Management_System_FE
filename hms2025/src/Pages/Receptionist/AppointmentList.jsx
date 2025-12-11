import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments, deleteAppointment, getPatients, getDoctors } from "../../api/api";
import "./AppointmentList.css";

// Utility function to format the date string to YYYY-MM-DD HH:MM
const formatAppointmentDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
};

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = { page, page_size: pageSize };

            // Fetch appointments
            const res = await getAppointments(params);
            const data = res.data.results ?? res.data;
            setAppointments(data);

            if (res.data.count) {
                setTotalCount(res.data.count);
                setTotalPages(Math.ceil(res.data.count / pageSize));
            } else {
                setTotalCount(data.length);
                setTotalPages(1);
            }

            // Fetch patients and doctors for name lookup
            const patRes = await getPatients({ page_size: 1000 });
            const docRes = await getDoctors({ page_size: 1000 });

            setPatients(patRes.data.results || patRes.data);
            setDoctors(docRes.data.results || docRes.data);

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const getPatientName = (id) => {
        if (!id) return "N/A";
        if (typeof id === 'object') return id.patient_name || "Unknown";

        const patient = patients.find(p => p.Patient_id === id || p.id === id);
        return patient ? patient.patient_name : id;
    };

    const getDoctorName = (id) => {
        if (!id) return "N/A";
        if (typeof id === 'object') return id.staff?.full_name || id.full_name || "Unknown";

        const doctor = doctors.find(d => d.doctor_id === id || d.id === id);
        return doctor ? (doctor.staff?.full_name || doctor.full_name) : id;
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await deleteAppointment(id);
            alert("Appointment cancelled successfully");
            fetchData();
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            alert("Failed to cancel appointment");
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusLower = (status || "pending").toLowerCase();
        switch (statusLower) {
            case "completed":
                return "status-completed";
            case "confirmed":
                return "status-confirmed";
            case "cancelled":
                return "status-cancelled";
            default:
                return "status-pending";
        }
    };

    const formatStatusText = (status) => {
        const statusLower = (status || "pending").toLowerCase();
        return statusLower.charAt(0).toUpperCase() + statusLower.slice(1);
    };

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Appointments</h2>
                <div>
                    <button className="refresh-btn" onClick={fetchData}>
                        Refresh
                    </button>
                    <Link to="/add-appointment" className="btn btn-success">
                        Book Appointment
                    </Link>
                </div>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading appointments...</div>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>TOKEN</th>
                                    <th>PATIENT</th>
                                    <th>DOCTOR</th>
                                    <th>DATE & TIME</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No appointments found
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((apt) => (
                                        <tr key={apt.Appointment_id ?? apt.id}>
                                            <td className="appointment-id">
                                                #{apt.Appointment_id ?? apt.id}
                                            </td>
                                            <td className="token">
                                                {apt.token ? `T-${apt.token}` : "N/A"}
                                            </td>
                                            <td className="patient-name">
                                                {getPatientName(apt.patient)}
                                            </td>
                                            <td className="doctor-name">
                                                {getDoctorName(apt.doctor)}
                                            </td>
                                            <td className="appointment-time">
                                                {formatAppointmentDate(apt.appointment_date)}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${getStatusBadgeClass(apt.status)}`}>
                                                    {formatStatusText(apt.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/edit-appointment/${apt.Appointment_id ?? apt.id}`}
                                                    className="btn-edit"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(apt.Appointment_id ?? apt.id)}
                                                    className="btn-delete"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="pagination-container">
                            <div className="pagination-info">
                                Showing {appointments.length} of {totalCount} appointments
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                >
                                    ← Previous
                                </button>
                                <div className="page-indicator">
                                    Page {page} of {totalPages}
                                </div>
                                <button
                                    className="pagination-btn"
                                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                    disabled={page === totalPages}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AppointmentList;