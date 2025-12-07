import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBasicVitalsById, updateBasicVitals } from "../../../api/api";
import "../../Admin/add.css";

const EditVitals = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        height: "",
        weight: "",
        blood_pressure: "",
        blood_sugar: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVitals = async () => {
            try {
                const response = await getBasicVitalsById(id);
                const data = response.data;
                setFormData({
                    height: data.height,
                    weight: data.weight,
                    blood_pressure: data.blood_pressure,
                    blood_sugar: data.blood_sugar,
                    appointment: data.appointment, // Include appointment ID
                });
            } catch (err) {
                console.error("Error fetching vitals:", err);
                setError("Failed to load vitals data.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchVitals();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure we send the appointment ID back for the PUT request
            await updateBasicVitals(id, formData);
            alert("Vitals updated successfully!");
            navigate(-1); // Go back to the previous page
        } catch (err) {
            console.error("Error updating vitals:", err);
            setError("Failed to update vitals. Please try again.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Edit Vitals</h2>
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

                    <button type="submit" className="submit-btn">Update Vitals</button>
                </form>
            </div>
        </div>
    );
};

export default EditVitals;
