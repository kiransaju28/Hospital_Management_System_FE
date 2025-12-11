import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMedicine } from "../../api/api";
import "./AddMedicine.css";

const AddMedicine = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        medicine_name: "",
        manufacture_name: "",
        dosage: "",
        price_per_unit: ""
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await createMedicine(formData);
            alert("Medicine added successfully!");
            navigate("/medicines"); // Redirect to medicine list
        } catch (err) {
            console.error(err);
            // Quick error handling - can be improved to show specific validation errors
            if (err.response && err.response.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError("Failed to add medicine. Please try again.");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Add Medicine</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Medicine Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="medicine_name"
                        value={formData.medicine_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Manufacturer Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="manufacture_name"
                        value={formData.manufacture_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Dosage (e.g., 500mg)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Price per Unit</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="price_per_unit"
                        value={formData.price_per_unit}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>

                <button type="submit" className="btn btn-success">Save Medicine</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/medicines")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddMedicine;
