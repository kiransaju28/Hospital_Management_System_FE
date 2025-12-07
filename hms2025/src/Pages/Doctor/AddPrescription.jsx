import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPrescriptionItem, getMedicines } from "../../api/api";
import "../Admin/add.css";

const AddPrescription = () => {
    const { consultationId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        medicine: "",
        dosage: "",
        frequency: "",
        duration: ""
    });

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [backendError, setBackendError] = useState(null);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                // Fetch medicines from backend
                const res = await getMedicines();
                const data = res.data.results || res.data;

                // If we get an array with items, use it. Otherwise throw to trigger catch/fallback.
                if (Array.isArray(data) && data.length > 0) {
                    setMedicines(data);
                } else {
                    throw new Error("No medicines found in backend, using placeholders.");
                }
            } catch (err) {
                console.warn("Using placeholder medicines:", err);
                // Placeholder list until backend is ready
                setMedicines([
                    { id: 1, name: "Paracetamol 500mg" },
                    { id: 2, name: "Amoxicillin 250mg" },
                    { id: 3, name: "Ibuprofen 400mg" },
                    { id: 4, name: "Cetirizine 10mg" },
                    { id: 5, name: "Metformin 500mg" },
                    { id: 6, name: "Aspirin 75mg" }
                ]);
            }
        };
        fetchMedicines();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setBackendError(null);

        const payload = {
            medicine: parseInt(formData.medicine), // Ensure ID is an integer
            dosage: formData.dosage,
            frequency: formData.frequency,
            duration: formData.duration,
            consultation: parseInt(consultationId)
        };

        console.log("Submitting Prescription Payload:", payload);

        try {
            await createPrescriptionItem(payload);
            alert("Prescription item added successfully!");
            // Clear form
            setFormData({
                medicine: "",
                dosage: "",
                frequency: "",
                duration: ""
            });
        } catch (err) {
            console.error("Error adding prescription:", err);
            if (err.response && err.response.data) {
                setBackendError(err.response.data);
                alert(`Failed: ${JSON.stringify(err.response.data)}`);
            } else {
                alert("Failed to add prescription.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Add Prescription</h2>

                {backendError && (
                    <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ef9a9a' }}>
                        <strong>Error Details:</strong>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(backendError, null, 2)}</pre>
                    </div>
                )}

                <div className="mb-3">
                    <button className="btn btn-secondary me-2" onClick={() => navigate(`/doctor/add-lab-test/${consultationId}`)}>
                        Go to Lab Tests
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate("/doctor/consultation-history")}>
                        Finish
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Medicine Name</label>
                        <select
                            name="medicine"
                            value={formData.medicine}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Medicine</option>
                            {medicines.map((med) => (
                                <option key={med.id || med.medicine_id || med.Medicine_id} value={med.id || med.medicine_id || med.Medicine_id}>
                                    {med.name || med.medicine_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Dosage</label>
                        <input
                            type="text"
                            name="dosage"
                            value={formData.dosage}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 500mg"
                        />
                    </div>

                    <div className="form-group">
                        <label>Frequency</label>
                        <input
                            type="text"
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 1-0-1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Duration</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 5 days"
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Adding..." : "Add Medicine"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPrescription;
