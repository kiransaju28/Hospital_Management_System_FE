import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTestCategory } from "../../api/api";
// This imports the entire CSS file and applies its styles
import './Add.css';

const AddTest = () => {
    const [categoryName, setCategoryName] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            category_name: categoryName
        };

        try {
            await createTestCategory(payload);
            alert("Test Category Added Successfully");
            navigate("/lab-tests"); // Adjust route as needed
        } catch (error) {
            console.error("Error adding test:", error.response?.data);
            alert("Error adding Test: " + (error.response?.data?.detail || "Unknown error"));
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Add Test Category</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Category Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="e.g. Blood Test"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 mt-3">
                                Add Test
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTest;
