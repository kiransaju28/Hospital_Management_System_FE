import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPrescriptionItemById, updatePrescriptionItem, getMedicines, getConsultationById, patchConsultation } from "../../api/api";
import "./EditPrescription.css";

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
    const [fulfillInternal, setFulfillInternal] = useState(false);
    const [consultationIdForToggle, setConsultationIdForToggle] = useState(null);

    const handleFulfillChange = async (e) => {
        if (!consultationIdForToggle) return;
        const newValue = e.target.checked;
        setFulfillInternal(newValue);
        try {
            await patchConsultation(consultationIdForToggle, { fulfill_pharmacist_internally: newValue });
        } catch (err) {
            console.error("Failed to update consultation status", err);
            alert("Failed to update status. Please try again.");
            setFulfillInternal(!newValue); // Revert on error
        }
    };

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

                let meds = [];
                // 2. Fetch Medicines List
                try {
                    const medRes = await getMedicines();
                    meds = medRes.data.results || medRes.data;

                    if (Array.isArray(meds) && meds.length > 0) {
                        setMedicines(meds);
                    } else {
                        throw new Error("Empty list");
                    }
                } catch (listErr) {
                    console.warn("Could not fetch medicines, using placeholders:", listErr);
                    meds = [
                        { id: 1, name: "Paracetamol 500mg" },
                        { id: 2, name: "Amoxicillin 250mg" },
                        { id: 3, name: "Ibuprofen 400mg" },
                        { id: 4, name: "Cetirizine 10mg" },
                        { id: 5, name: "Metformin 500mg" },
                        { id: 6, name: "Aspirin 75mg" }
                    ];
                    setMedicines(meds);
                }

                console.log("Prescription Item:", item);
                console.log("Medicines List:", meds);

                const extractedMedId = item.medicine?.medicine_id || item.medicine?.id || item.medicine;
                const extractedConsultId = item.consultation?.consultation_id || item.consultation?.id || item.consultation;

                console.log("Extracted Med ID:", extractedMedId, "Type:", typeof extractedMedId);
                console.log("Extracted Consult ID:", extractedConsultId, "Type:", typeof extractedConsultId);

                setFormData({
                    medicine: String(extractedMedId), // Store as string for select element
                    dosage: item.dosage,
                    frequency: item.frequency,
                    duration: item.duration,
                    consultation: String(extractedConsultId) // Store as string for consistency
                });

                if (extractedConsultId) {
                    setConsultationIdForToggle(extractedConsultId);
                    try {
                        const consRes = await getConsultationById(extractedConsultId);
                        setFulfillInternal(consRes.data.fulfill_pharmacist_internally);
                    } catch (consErr) {
                        console.warn("Could not fetch consultation status", consErr);
                    }
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

        console.log("Form Data before submit:", formData);

        const medicineId = parseInt(formData.medicine, 10);
        const consultationId = parseInt(formData.consultation, 10);

        console.log("Parsed Medicine ID:", medicineId, "Is valid:", !isNaN(medicineId));
        console.log("Parsed Consultation ID:", consultationId, "Is valid:", !isNaN(consultationId));

        if (isNaN(medicineId)) {
            alert("Invalid medicine selected. Please select a medicine from the dropdown.");
            setLoading(false);
            return;
        }

        if (isNaN(consultationId)) {
            alert("Invalid consultation data. Please try again.");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                consultation: consultationId,
                medicine: medicineId,
                dosage: formData.dosage,
                frequency: formData.frequency,
                duration: formData.duration
            };

            console.log("Final Payload being sent:", payload);
            console.log("Payload types:", {
                consultation: typeof payload.consultation,
                medicine: typeof payload.medicine
            });

            await updatePrescriptionItem(id, payload);
            alert("Prescription updated successfully!");
            navigate(-1);
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

                    <div className="form-group">
                        <div className="checkbox-wrapper" style={{ marginTop: '10px', marginBottom: '10px' }}>
                            <label style={{ cursor: 'pointer', userSelect: 'none', fontWeight: '500' }}>
                                <input
                                    type="checkbox"
                                    checked={fulfillInternal}
                                    onChange={handleFulfillChange}
                                    style={{ marginRight: '8px' }}
                                />
                                Fulfill at Pharmacist (Internal)
                            </label>
                        </div>
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
