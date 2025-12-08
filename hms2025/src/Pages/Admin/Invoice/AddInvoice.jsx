import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBill, getAppointments, getPatients, getDoctors } from "../../../api/api";
import "../add.css";

const AddInvoice = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch appointments, patients and doctors to display meaningful info
                const aptRes = await getAppointments({ page_size: 100 });
                const patRes = await getPatients({ page_size: 100 });
                const docRes = await getDoctors({ page_size: 100 });

                setAppointments(aptRes.data.results || aptRes.data);
                setPatients(patRes.data.results || patRes.data);
                setDoctors(docRes.data.results || docRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const getPatientName = (id) => {
        if (!id) return "Unknown";
        if (typeof id === 'object') return id.patient_name || "Unknown";
        const p = patients.find(pat => pat.Patient_id === id || pat.id === id);
        return p ? p.patient_name : id;
    };

    const getDoctorName = (id) => {
        if (!id) return "Unknown";
        if (typeof id === 'object') return id.staff?.full_name || id.full_name || "Unknown";
        const d = doctors.find(doc => doc.doctor_id === id || doc.id === id);
        return d ? (d.staff?.full_name || d.full_name) : id;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createBill({ appointment: selectedAppointment });
            alert("Invoice generated successfully!");
            navigate("/admin/invoices");
        } catch (err) {
            console.error("Error generating invoice:", err);
            const errorMessage = err.response?.data?.detail || err.response?.data?.non_field_errors || JSON.stringify(err.response?.data) || "Failed to generate invoice.";
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Generate Invoice</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Appointment</label>
                        <select
                            value={selectedAppointment}
                            onChange={(e) => setSelectedAppointment(e.target.value)}
                            required
                        >
                            <option value="">-- Select Appointment --</option>
                            {appointments.map((apt) => (
                                <option key={apt.Appointment_id || apt.id} value={apt.Appointment_id || apt.id}>
                                    {apt.token ? `[${apt.token}] ` : ""}
                                    {getPatientName(apt.patient)} - {getDoctorName(apt.doctor)}
                                    ({apt.appointment_date ? apt.appointment_date.slice(0, 10) : "N/A"})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Generating..." : "Generate Invoice"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddInvoice;
