import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createLabTestOrder, getTestCategories } from "../../api/api";
import "./AddLabTest.css";

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
                // Fetch test categories from backend
                const res = await getTestCategories();
                const data = res.data.results || res.data;

                if (Array.isArray(data) && data.length > 0) {
                    setAvailableTests(data);
                } else {
                    console.warn("No lab test categories found in backend");
                    setAvailableTests([]);
                }
            } catch (err) {
                console.error("Error fetching lab test categories:", err);
                alert("Failed to load lab test categories. Please try again.");
                setAvailableTests([]);
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
                            <option value="">Select Lab Test Category</option>
                            {availableTests.map((t) => (
                                <option key={t.LabTestCategory_id} value={t.LabTestCategory_id}>
                                    {t.category_name}
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
