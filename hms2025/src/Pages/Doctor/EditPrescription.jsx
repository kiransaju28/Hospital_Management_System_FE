import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPrescriptionItemById, updatePrescriptionItem, getMedicines } from "../../api/api";
import "../Admin/add.css";

const EditPrescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        medicine: "",
        dosage: "",
        frequency: "",
        duration: ""
    });

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id || id === 'undefined') {
            alert("Invalid Prescription ID parameter.");
            navigate(-1);
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Item Details
                const itemRes = await getPrescriptionItemById(id);
                const item = itemRes.data;

                setFormData({
                    medicine: item.medicine?.id || item.medicine, // Handle object or ID
                    dosage: item.dosage,
                    frequency: item.frequency,
                    duration: item.duration,
                    consultation: item.consultation // Keep consultation ID for reference
                });

                // 2. Fetch Medicines List
                try {
                    const medRes = await getMedicines();
                    const meds = medRes.data.results || medRes.data;

                    if (Array.isArray(meds) && meds.length > 0) {
                        setMedicines(meds);
                    } else {
                        throw new Error("Empty list");
                    }
                } catch (listErr) {
                    console.warn("Could not fetch medicines, using placeholders:", listErr);
                    setMedicines([
                        { id: 1, name: "Paracetamol 500mg" },
                        { id: 2, name: "Amoxicillin 250mg" },
                        { id: 3, name: "Ibuprofen 400mg" },
                        { id: 4, name: "Cetirizine 10mg" },
                        { id: 5, name: "Metformin 500mg" },
                        { id: 6, name: "Aspirin 75mg" }
                    ]);
                }

            } catch (err) {
                console.error("Error loading prescription data:", err);
                setError("Failed to load prescription details.");
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
        setLoading(true);
        setError(null);

        try {
            const payload = {
                consultation: formData.consultation, // Required by backend usually
                medicine: parseInt(formData.medicine),
                dosage: formData.dosage,
                frequency: formData.frequency,
                duration: formData.duration
            };

            await updatePrescriptionItem(id, payload);
            alert("Prescription updated successfully!");
            navigate(-1); // Go back
        } catch (err) {
            console.error("Error updating prescription:", err);
            if (err.response && err.response.data) {
                alert(`Failed: ${JSON.stringify(err.response.data)}`);
            } else {
                alert("Failed to update prescription.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Edit Prescription</h2>
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
                                <option key={med.id || med.medicine_id} value={med.id || med.medicine_id}>
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
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Updating..." : "Update Prescription"}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPrescription;
