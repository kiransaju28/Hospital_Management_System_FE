import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAppointmentById,
    updateAppointment,
    getPatients,
    getDoctors,
    getAppointments
} from "../../api/api";
import "../Admin/add.css";

const EditAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        patient: "",
        doctor: "",
        appointment_date: "",
        status: ""
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patRes = await getPatients();
                const docRes = await getDoctors();

                setPatients(patRes.data.results || patRes.data);
                setDoctors(docRes.data.results || docRes.data);

                const aptRes = await getAppointmentById(id);
                const apt = aptRes.data;

                setFormData({
                    patient: apt.patient?.id || apt.patient, // Handle object or ID
                    doctor: apt.doctor?.id || apt.doctor,    // Handle object or ID
                    token: apt.token,
                    appointment_date: apt.appointment_date ? apt.appointment_date.slice(0, 16) : "",
                    status: apt.status
                });

            } catch (err) {
                console.error("Error loading data:", err);
                alert("Failed to load appointment details");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const doctorId = Number(formData.doctor);
        const apptDate = new Date(formData.appointment_date);

        try {
            // Validation: Check for time conflicts with the (possibly new) doctor
            const apptRes = await getAppointments({ doctor: doctorId });
            const appointments = apptRes.data.results || apptRes.data;

            const hasConflict = appointments.some(appt => {
                // Exclude current appointment from check
                const remoteId = appt.Appointment_id || appt.id;
                if (String(remoteId) === String(id)) return false;

                // Get doctor ID
                let apptDoctorId;
                if (typeof appt.doctor === 'object' && appt.doctor !== null) {
                    apptDoctorId = appt.doctor.doctor_id || appt.doctor.id;
                } else {
                    apptDoctorId = appt.doctor;
                }

                if (parseInt(apptDoctorId) !== doctorId) return false;
                if (appt.status === 'Cancelled') return false;

                const existingDate = new Date(appt.appointment_date);
                const diffMs = Math.abs(apptDate - existingDate);
                const diffMins = diffMs / (1000 * 60);

                return diffMins < 60;
            });

            if (hasConflict) {
                alert("This doctor has another appointment within 1 hour of this time.");
                return;
            }

            const payload = {
                patient: Number(formData.patient),
                doctor: doctorId,
                status: formData.status,
                appointment_date: formData.appointment_date,
            };

            await updateAppointment(id, payload);
            alert("Appointment updated successfully!");
            navigate("/appointments");
        } catch (err) {
            console.error("Error updating appointment:", err);
            alert("Failed to update appointment");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Edit Appointment</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Patient</label>
                        <select
                            name="patient"
                            value={formData.patient}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Patient</option>
                            {patients.map((p) => (
                                <option key={p.Patient_id} value={p.Patient_id}>
                                    {p.patient_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Doctor</label>
                        <select
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map((d) => (
                                <option key={d.doctor_id} value={d.doctor_id}>
                                    {d.staff?.full_name || d.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Token</label>
                        <input
                            type="text"
                            value={formData.token || ""}
                            readOnly
                            disabled
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Date & Time</label>
                        <input
                            type="datetime-local"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                            readOnly
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">
                        Update Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditAppointment;
