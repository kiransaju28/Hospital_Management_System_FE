import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments, deleteAppointment, getPatients, getDoctors } from "../../api/api";
import "../Admin/List.css";

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
                setTotalPages(Math.ceil(res.data.count / pageSize));
            } else {
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

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Appointments</h3>
                <Link to="/add-appointment" className="btn btn-success">Book Appointment</Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Token</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No appointments found</td>
                                </tr>
                            ) : (
                                appointments.map((apt) => (
                                    <tr key={apt.Appointment_id ?? apt.id}>
                                        <td>{apt.Appointment_id ?? apt.id}</td>
                                        <td>{apt.token ?? "N/A"}</td>
                                        <td>{getPatientName(apt.patient)}</td>
                                        <td>{getDoctorName(apt.doctor)}</td>
                                        <td>{formatAppointmentDate(apt.appointment_date)}</td>
                                        <td>{apt.status ?? "Pending"}</td>
                                        <td>
                                            <Link
                                                to={`/edit-appointment/${apt.Appointment_id ?? apt.id}`}
                                                className="btn btn-sm btn-primary me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(apt.Appointment_id ?? apt.id)}
                                                className="btn btn-sm btn-danger"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AppointmentList;
