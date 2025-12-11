import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createMedicineStock, getMedicines } from "../../api/api";
import "./AddStock.css";

const AddStock = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [formData, setFormData] = useState({
        medicine: "",
        quantity_in_stock: "",
        purchase_price: "",
        Reorder_level: "",
        Created_Date: new Date().toISOString().split("T")[0],
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            // Assuming getMedicines returns a list of medicines
            const response = await getMedicines();
            setMedicines(response.data);
        } catch (err) {
            console.error("Error fetching medicines", err);
            setError("Failed to load medicines list.");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!formData.medicine) {
            setError("Please select a medicine.");
            return;
        }

        try {
            await createMedicineStock(formData);
            navigate("/pharmacist/stock");
        } catch (err) {
            console.error("Error adding stock:", err);
            setError("Failed to add stock. Please try again.");
        }
    };

    return (
        <div className="add-stock-container">
            <div className="add-stock-card">
                <h2>Add Medicine Stock</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Medicine</label>
                        <select
                            name="medicine"
                            value={formData.medicine}
                            onChange={handleChange}
                            required
                            className="form-control"
                        >
                            <option value="">-- Select Medicine --</option>
                            {medicines.map((med) => (
                                <option key={med.Medicine_id} value={med.Medicine_id}>
                                    {med.medicine_name} ({med.dosage})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity_in_stock"
                            value={formData.quantity_in_stock}
                            onChange={handleChange}
                            required
                            className="form-control"
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Purchase Price (Per Unit)</label>
                        <div className="input-group">
                            {/* Removed currency symbol */}
                            <input
                                type="number"
                                name="purchase_price"
                                value={formData.purchase_price}
                                onChange={handleChange}
                                required
                                className="form-control"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Reorder Level</label>
                        <input
                            type="number"
                            name="Reorder_level"
                            value={formData.Reorder_level}
                            onChange={handleChange}
                            required
                            className="form-control"
                            min="0"
                            placeholder="e.g., 50"
                        />
                        <small className="form-text">
                            Alert when stock falls below this quantity.
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Date Received</label>
                        <input
                            type="date"
                            name="Created_Date"
                            value={formData.Created_Date}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            Add Stock
                        </button>
                        <Link to="/pharmacist/stock" className="cancel-btn">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStock;
