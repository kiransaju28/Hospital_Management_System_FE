import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createConsultation, patchAppointment } from "../../api/api";
import "./AddConsultation.css";

const AddConsultation = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        symptoms: "",
        diagnosis: "",
        notes: "",
        fulfill_pharmacist_internally: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Prepare payload
        const payload = {
            ...formData,
            appointment: parseInt(appointmentId, 10),
        };

        try {
            const response = await createConsultation(payload);
            const newConsultationId = response.data.consultation_id || response.data.id;

            // Mark appointment as Completed
            try {
                const patchRes = await patchAppointment(appointmentId, { status: "Completed" });
                // Check if backend actually updated it (if status is read-only, it wouldn't change)
                if (patchRes.data.status !== "Completed") {
                    console.warn("Backend ignored status update. Status is:", patchRes.data.status);
                    alert("Warning: The appointment could not be marked as 'Completed' because the backend 'status' field is likely read-only. Please update 'receptionist/serializers.py' to remove 'status' from 'read_only_fields'.");
                }
            } catch (statusErr) {
                console.warn("Failed to update appointment status:", statusErr);
                // Don't block the flow if status update fails, just warn
            }

            alert("Consultation recorded successfully!");

            // Ask user where to go next
            if (window.confirm("Do you want to add prescriptions now?")) {
                navigate(`/doctor/add-prescription/${newConsultationId}`);
            } else if (window.confirm("Do you want to order lab tests now?")) {
                navigate(`/doctor/add-lab-test/${newConsultationId}`);
            } else {
                navigate("/doctor/consultation-history");
            }
        } catch (err) {
            console.error("Error adding consultation:", err);
            let errorMessage = "Failed to add consultation.";

            if (err.response && err.response.data) {
                const data = err.response.data;
                // Check if error is about duplicate consultation
                if (data.appointment && JSON.stringify(data.appointment).includes("already exists")) {
                    if (window.confirm("A consultation records already exists for this appointment. Do you want to view history or add prescriptions/labs instead?")) {
                        // We don't have the existing consultation ID here to redirect perfectly, 
                        // so best is to go to history
                        navigate("/doctor/consultation-history");
                        return;
                    }
                }
                errorMessage = `Error: ${JSON.stringify(data)}`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Doctor Consultation</h2>
                {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Symptoms</label>
                        <textarea
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleChange}
                            required
                            rows="3"
                            placeholder="Patient's symptoms..."
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Diagnosis</label>
                        <textarea
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            required
                            rows="3"
                            placeholder="Doctor's diagnosis..."
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            required
                            rows="3"
                            placeholder="Additional notes..."
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save Consultation"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddConsultation;
