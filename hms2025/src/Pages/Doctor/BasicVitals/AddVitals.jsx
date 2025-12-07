import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBasicVitals } from "../../../api/api";
import "../../Admin/add.css";

const AddVitals = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        height: "",
        weight: "",
        blood_pressure: "",
        blood_sugar: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debugging: Log the ID on component mount
    useEffect(() => {
        console.log("AddVitals mounted. Appointment ID from URL:", appointmentId);
    }, [appointmentId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Strict validation of appointmentId
        if (!appointmentId || appointmentId === "undefined" || appointmentId === "null") {
            alert("Critical Error: Appointment ID is missing from the URL. Please go back and select the appointment again.");
            setLoading(false);
            return;
        }

        // Prepare payload - correct types
        const payload = {
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            blood_pressure: formData.blood_pressure,
            blood_sugar: parseFloat(formData.blood_sugar),
            appointment: parseInt(appointmentId, 10),
        };

        console.log("Sending Payload:", payload); // DEBUG LOG

        try {
            await createBasicVitals(payload);
            alert("Vitals recorded successfully!");
            navigate("/doctor-dashboard");
        } catch (err) {
            console.error("Error adding vitals:", err);
            // Extract detailed error message if available
            let errorMessage = "Failed to add vitals. Please try again.";
            if (err.response && err.response.data) {
                if (err.response.data.appointment) {
                    errorMessage = `Error: ${err.response.data.appointment}`;
                } else {
                    errorMessage = `Validation Error: ${JSON.stringify(err.response.data)}`;
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Add Vitals</h2>
                {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Height (cm)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Weight (kg)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Blood Pressure (mmHg)</label>
                        <input
                            type="text"
                            name="blood_pressure"
                            placeholder="e.g. 120/80"
                            value={formData.blood_pressure}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Blood Sugar (mg/dL)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="blood_sugar"
                            value={formData.blood_sugar}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save Vitals"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVitals;
