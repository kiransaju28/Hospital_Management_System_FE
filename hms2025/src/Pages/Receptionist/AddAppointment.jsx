import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAppointment, getPatients, getDoctors } from "../../api/api";
import "../Admin/add.css";

const AddAppointment = () => {
    const [formData, setFormData] = useState({
        patient: "",
        doctor: "",
        appointment_date: "", // Assuming this might be needed, though not in user's example payload, it's usually required. 
        // If not, I'll remove it or make it optional. 
        // The user example just showed patient and doctor. I'll stick to that for now but add date as it's standard.
        // Actually, let's check the user request again. 
        // "POST /api/receptionist/appointments/ { "patient": 1, "doctor": 1 }"
        // It seems minimal. I'll add date/time just in case, or maybe the backend sets it to NOW?
        // I'll add it as a field but if it fails I'll remove it.
        // Better yet, I'll add it because an appointment usually needs a time.
        status: "Pending"
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patRes = await getPatients({ page_size: 100 }); // Fetch enough for dropdown
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
            const payload = {
                patient: parseInt(formData.patient),
                doctor: parseInt(formData.doctor),
                appointment_date: formData.appointment_date,
                // status: formData.status
            };
            await createAppointment(payload);
            alert("Appointment created successfully!");
            navigate("/appointments");
        } catch (err) {
            console.error("Error creating appointment:", err);
            alert("Failed to create appointment");
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
                                <option key={p.Patient_id} value={p.Patient_id}>
                                    {p.patient_name} (ID: {p.Patient_id})
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
                                    {d.staff?.full_name || d.full_name} ({d.specialization?.specialization_name || d.specialization_name})
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

                    <button type="submit" className="submit-btn">Book Appointment</button>
                </form>
            </div>
        </div>
    );
};

export default AddAppointment;
