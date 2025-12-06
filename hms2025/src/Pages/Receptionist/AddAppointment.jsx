import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAppointment, getPatients, getDoctors, getAppointments } from "../../api/api";
import "../Admin/add.css";

const AddAppointment = () => {
    const [formData, setFormData] = useState({
        patient: "",
        doctor: "",
        appointment_date: "",
        status: "Scheduled"
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patRes = await getPatients({ page_size: 100 });
                const docRes = await getDoctors({ page_size: 100 });

                setPatients(patRes.data.results || patRes.data);
                setDoctors(docRes.data.results || docRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const doctorId = parseInt(formData.doctor, 10);
            // Convert local datetime-local input to ISO UTC for backend
            const dateISO = new Date(formData.appointment_date).toISOString();

            // Fetch existing appointments to check for conflicts (server-side filtering by doctor if supported)
            const apptRes = await getAppointments({ doctor: doctorId });
            const appointments = apptRes.data.results || apptRes.data;

            const newDate = new Date(dateISO);

            const hasConflict = appointments.some(appt => {
                // Exclude cancelled appointments
                if (appt.status === 'Cancelled') return false;

                // Get doctor ID from appointment (handle object or ID)
                let apptDoctorId;
                if (typeof appt.doctor === 'object' && appt.doctor !== null) {
                    apptDoctorId = appt.doctor.doctor_id || appt.doctor.id;
                } else {
                    apptDoctorId = appt.doctor;
                }

                if (parseInt(apptDoctorId, 10) !== doctorId) return false;

                const apptDate = new Date(appt.appointment_date);
                if (isNaN(apptDate.getTime())) return false;

                const diffMs = Math.abs(newDate - apptDate);
                const diffMins = diffMs / (1000 * 60);

                return diffMins < 60;
            });

            if (hasConflict) {
                alert("This doctor has another appointment within 1 hour of this time. Please choose a different time.");
                return;
            }

            const payload = {
                patient: parseInt(formData.patient, 10),
                doctor: doctorId,
                appointment_date: dateISO,
                status: formData.status.trim()
            };

            console.log("Sending appointment payload:", payload);

            await createAppointment(payload);
            alert("Appointment created successfully!");
            navigate("/appointments");
        } catch (err) {
            console.error("Error creating appointment:", err);

            if (err.response && err.response.data) {
                let errorMsg = "Failed to create appointment:\n";
                const data = err.response.data;

                // Recursively parse error data
                const formatErrors = (obj, prefix = '') => {
                    let msg = '';
                    if (typeof obj === 'string') {
                        return `${prefix}${obj}\n`;
                    }
                    if (Array.isArray(obj)) {
                        return obj.map(m => `${prefix}- ${m}\n`).join('');
                    }
                    if (typeof obj === 'object' && obj !== null) {
                        for (let [key, val] of Object.entries(obj)) {
                            msg += formatErrors(val, `${prefix}${key}: `);
                        }
                    }
                    return msg;
                };

                errorMsg += formatErrors(data);
                alert(errorMsg);
            } else {
                alert("Failed to create appointment.");
            }
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Book Appointment</h2>
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
                                <option key={p.Patient_id ?? p.id} value={p.Patient_id ?? p.id}>
                                    {p.patient_name} (ID: {p.Patient_id ?? p.id})
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
                                <option key={d.doctor_id ?? d.id} value={d.doctor_id ?? d.id}>
                                    {d.staff?.full_name || d.full_name} ({d.specialization?.specialization_name || d.specialization_name || "General"})
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
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">Book Appointment</button>
                </form>
            </div>
        </div>
    );
};

export default AddAppointment;
