import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMedicineById, updateMedicine } from "../../api/api";
import "./EditMedicine.css";

const EditMedicine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        medicine_name: "",
        manufacture_name: "",
        dosage: "",
        quantity_in_stock: "",
        price_per_unit: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMedicine();
    }, [id]);

    const fetchMedicine = async () => {
        try {
            const res = await getMedicineById(id);
            // Ensure we set all fields, handling potential missing values if necessary
            setFormData({
                medicine_name: res.data.medicine_name,
                manufacture_name: res.data.manufacture_name,
                dosage: res.data.dosage,
                quantity_in_stock: res.data.quantity_in_stock,
                price_per_unit: res.data.price_per_unit
            });
        } catch (err) {
            console.error("Error fetching medicine details:", err);
            setError("Failed to load medicine details.");
        } finally {
            setLoading(false);
        }
    };

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
            await updateMedicine(id, formData);
            alert("Medicine updated successfully!");
            navigate("/medicines");
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                setError(JSON.stringify(err.response.data));
            } else {
                setError("Failed to update medicine.");
            }
        }
    };

    if (loading) return <div className="container mt-4">Loading medicine details...</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Edit Medicine</h2>
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
                    <label className="form-label">Dosage</label>
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

                <button type="submit" className="btn btn-primary">Update Medicine</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/medicines")}
                >
                    Cancel
                </button>
            </form >
        </div >
    );
};

export default EditMedicine;
