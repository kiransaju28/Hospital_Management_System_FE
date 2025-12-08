import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayAppointments } from "../../api/api";
import "./ViewAppointment.css";

const ViewAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await getTodayAppointments();
            console.log("Fetched Today's Appointments:", response.data);
            setAppointments(response.data);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError("Failed to load today's appointments.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading appointments...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Today's Appointments</h2>
                <div className="d-flex gap-2">
                    <button className="refresh-btn" onClick={() => navigate('/doctor/consultation-history')}>
                        History
                    </button>
                    <button className="refresh-btn" onClick={fetchAppointments}>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                {appointments.length === 0 ? (
                    <p className="no-data">No appointments scheduled for today.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Token</th>
                                <th>Patient Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments
                                .filter((app) => !app.status || app.status.toLowerCase() !== "completed")
                                .map((appointment) => {
                                    // Robust ID extraction
                                    const id = appointment.appointment_id || appointment.Appointment_id || appointment.id;

                                    // Robust Patient Name extraction
                                    const patientName =
                                        appointment.patient_name ||
                                        appointment.patient?.patient_name ||
                                        appointment.patient?.name ||
                                        (typeof appointment.patient === 'object' ? appointment.patient.name : null) ||
                                        appointment.patient_id ||
                                        (typeof appointment.patient !== 'object' ? `Patient ID: ${appointment.patient}` : "Unknown");

                                    // Safely handle status
                                    const status = appointment.status || "Pending";

                                    return (
                                        <tr key={id || Math.random()}>
                                            <td>{appointment.token_number || appointment.token || "-"}</td>
                                            <td>
                                                {patientName}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${status.toLowerCase()}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    {/* Action to Add Vitals */}
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => {
                                                            if (!id) {
                                                                alert("Error: Could not find Appointment ID. Please check the data.");
                                                                console.error("Missing ID for appointment:", appointment);
                                                                return;
                                                            }
                                                            console.log("Navigating to Add Vitals for ID:", id);
                                                            navigate(`/doctor/add-vitals/${id}`);
                                                        }}
                                                        title="Record Vitals"
                                                    >
                                                        Add Vitals
                                                    </button>

                                                    {/* Action to Consult */}
                                                    <button
                                                        className="btn-view"
                                                        onClick={() => {
                                                            if (!id) return;
                                                            navigate(`/doctor/add-consultation/${id}`);
                                                        }}
                                                        title="Start Consultation"
                                                    >
                                                        Consult
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewAppointment;
