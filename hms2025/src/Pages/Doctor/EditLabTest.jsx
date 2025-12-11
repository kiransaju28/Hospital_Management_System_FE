import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabTestOrderById, updateLabTestOrder, getTestCategories } from "../../api/api";
import "./EditLabTest.css";

const EditLabTest = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        test: "",
        test_description: ""
    });

    const [availableTests, setAvailableTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id || id === 'undefined') {
            alert("Invalid Lab Test ID parameter.");
            navigate(-1);
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch the Order Details (Critical)
                const itemRes = await getLabTestOrderById(id);
                const item = itemRes.data;

                setFormData({
                    test: item.test?.test_id || item.test?.lab_test_id || item.test?.id || item.test,
                    test_description: item.test_description,
                    consultation: item.consultation?.consultation_id || item.consultation?.id || item.consultation
                });

                // 2. Fetch Available Test Categories
                try {
                    const testsRes = await getTestCategories();
                    const tests = testsRes.data.results || testsRes.data;

                    if (Array.isArray(tests) && tests.length > 0) {
                        setAvailableTests(tests);
                    } else {
                        console.warn("No lab test categories found in backend");
                        setAvailableTests([]);
                    }
                } catch (listErr) {
                    console.error("Error fetching lab test categories:", listErr);
                    setAvailableTests([]);
                }

            } catch (err) {
                console.error("Error loading lab test data:", err);
                setError("Failed to load lab test details.");
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

        try {
            const testId = parseInt(formData.test);
            const consultationId = parseInt(formData.consultation);

            const payload = {
                consultation: consultationId,
                test: testId,
                test_description: formData.test_description
            };

            await updateLabTestOrder(id, payload);
            alert("Lab test updated successfully!");
            navigate(-1);
        } catch (err) {
            console.error("Error updating lab test:", err);
            if (err.response && err.response.data) {
                alert(`Failed: ${JSON.stringify(err.response.data)}`);
            } else {
                alert("Failed to update lab test.");
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
                <h2>Edit Lab Test Order</h2>
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
                        {loading ? "Updating..." : "Update Order"}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditLabTest;
