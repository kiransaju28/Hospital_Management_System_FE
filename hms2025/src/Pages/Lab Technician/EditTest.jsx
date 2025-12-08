import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTestCategoryById, updateTestCategory } from "../../api/api";
import './EditTest.css';

const EditTest = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch test category details
                const res = await getTestCategoryById(id);
                setCategoryName(res.data.category_name || "");
            } catch (err) {
                console.error("Error loading data:", err);
                alert("Failed to load test details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                category_name: categoryName
            };

            await updateTestCategory(id, payload);
            alert("Test Category updated successfully");
            navigate("/lab-tests");
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update test category");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Edit Test Category</h2>
                        <form onSubmit={handleSubmit} className="mt-3">
                            <div className="mb-3">
                                <label className="form-label">Category Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 mt-3">Update Test</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTest;
