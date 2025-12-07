import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createLabTestOrder, getAvailableLabTests } from "../../api/api";
import "../Admin/add.css";

const AddLabTest = () => {
    const { consultationId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        test: "",
        test_description: ""
    });

    const [availableTests, setAvailableTests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                // Fetch tests from backend
                const res = await getAvailableLabTests();
                const data = res.data.results || res.data;

                if (Array.isArray(data) && data.length > 0) {
                    setAvailableTests(data);
                } else {
                    throw new Error("No lab tests found in backend, using placeholders.");
                }
            } catch (err) {
                console.warn("Using placeholder lab tests:", err);
                // Placeholder list
                setAvailableTests([
                    { id: 1, name: "Complete Blood Count (CBC)" },
                    { id: 2, name: "Lipid Profile" },
                    { id: 3, name: "Thyroid Function Test (TFT)" },
                    { id: 4, name: "Blood Sugar Fasting" },
                    { id: 5, name: "Liver Function Test (LFT)" },
                    { id: 6, name: "Kidney Function Test (KFT)" },
                    { id: 7, name: "Urine Routine" }
                ]);
            }
        };
        fetchTests();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            test: parseInt(formData.test), // Send ID
            test_description: formData.test_description,
            consultation: parseInt(consultationId)
        };

        try {
            await createLabTestOrder(payload);
            alert("Lab test order added successfully!");
            setFormData({ test: "", test_description: "" });
        } catch (err) {
            console.error("Error adding lab test:", err);
            if (err.response && err.response.data) {
                alert(`Failed: ${JSON.stringify(err.response.data)}`);
            } else {
                alert("Failed to add lab test.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Order Lab Test</h2>
                <div className="mb-3">
                    <button className="btn btn-secondary me-2" onClick={() => navigate(`/doctor/add-prescription/${consultationId}`)}>
                        Go to Prescriptions
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate("/doctor/consultation-history")}>
                        Finish
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Test Name</label>
                        <select
                            name="test"
                            value={formData.test}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Lab Test</option>
                            {availableTests.map((t) => (
                                <option key={t.id || t.test_id || t.Test_id} value={t.id || t.test_id || t.Test_id}>
                                    {t.name || t.test_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description / Notes</label>
                        <textarea
                            name="test_description"
                            value={formData.test_description}
                            onChange={handleChange}
                            rows="3"
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Ordering..." : "Order Test"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddLabTest;
