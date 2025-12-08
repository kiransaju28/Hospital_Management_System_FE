import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAppointmentById,
    updateAppointment,
    getPatients,
    getDoctors,
    getAppointments
} from "../../api/api";
import "./EditAppointment.css";

// Convert backend ISO date to "YYYY-MM-DDTHH:MM" without shifting timezone
const formatToLocalDatetimeInput = (isoDateString) => {
    if (!isoDateString) return "";

    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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
                    patient: apt.patient?.id ?? apt.patient ?? "",
                    doctor: apt.doctor?.id ?? apt.doctor ?? "",
                    appointment_date: formatToLocalDatetimeInput(apt.appointment_date),
                    status: apt.status ?? "Scheduled",
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

        try {
            const doctorId = Number(formData.doctor);

            // ❗ KEY FIX: NO UTC conversion – backend expects local time
            const appointmentDate = formData.appointment_date + ":00";

            // Validate conflict
            const apptRes = await getAppointments({ doctor: doctorId });
            const appointments = apptRes.data.results || apptRes.data;

            const newDate = new Date(appointmentDate);

            const hasConflict = appointments.some((appt) => {
                const apptId = appt.Appointment_id ?? appt.id;
                if (String(apptId) === String(id)) return false;

                let apptDoctorId;
                if (typeof appt.doctor === "object") {
                    apptDoctorId = appt.doctor.doctor_id || appt.doctor.id;
                } else {
                    apptDoctorId = appt.doctor;
                }
                if (apptDoctorId !== doctorId) return false;
                if (appt.status === "Cancelled") return false;

                const existingDate = new Date(appt.appointment_date);
                const diffMins = Math.abs(newDate - existingDate) / (1000 * 60);
                return diffMins < 60;
            });

            if (hasConflict) {
                alert("This doctor has another appointment within 1 hour.");
                return;
            }

            const payload = {
                patient: Number(formData.patient),
                doctor: doctorId,
                appointment_date: appointmentDate, // Local time saved directly
                status: formData.status,
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
                        <select name="patient" value={formData.patient} onChange={handleChange}>
                            <option value="">Select Patient</option>
                            {patients.map((p) => (
                                <option key={p.Patient_id ?? p.id} value={p.Patient_id ?? p.id}>
                                    {p.patient_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Doctor</label>
                        <select name="doctor" value={formData.doctor} onChange={handleChange}>
                            <option value="">Select Doctor</option>
                            {doctors.map((d) => (
                                <option key={d.doctor_id ?? d.id} value={d.doctor_id ?? d.id}>
                                    {d.staff?.full_name || d.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date & Time</label>
                        <input
                            type="datetime-local"
                            name="appointment_date"
                            value={formData.appointment_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">Update Appointment</button>
                </form>
            </div>
        </div>
    );
};

export default EditAppointment;
