import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMedicineStockById, updateMedicineStock, getMedicines } from "../../api/api";
import "./EditStock.css";

const EditStock = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [formData, setFormData] = useState({
        medicine: "",
        quantity_in_stock: "",
        purchase_price: "",
        Reorder_level: "",
        Created_Date: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stockRes, medicinesRes] = await Promise.all([
                    getMedicineStockById(id),
                    getMedicines()
                ]);

                setMedicines(medicinesRes.data);

                // Populate form with existing data
                // Note: handling potential differences in API response keys
                const stockData = stockRes.data;
                setFormData({
                    medicine: stockData.medicine || stockData.medicine_id || "",
                    quantity_in_stock: stockData.quantity || stockData.quantity_in_stock || "",
                    purchase_price: stockData.purchase_price || "",
                    Reorder_level: stockData.Reorder_level || "",
                    Created_Date: stockData.Created_Date ? stockData.Created_Date.split("T")[0] : "",
                });

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load stock details.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Ensure we send the correct payload structure expected by backend
            const payload = {
                medicine: formData.medicine,
                quantity_in_stock: formData.quantity_in_stock,
                purchase_price: formData.purchase_price,
                Reorder_level: formData.Reorder_level,
                Created_Date: formData.Created_Date
            };

            await updateMedicineStock(id, payload);
            navigate("/pharmacist/stock");
        } catch (err) {
            console.error("Error updating stock:", err);
            setError("Failed to update stock. Please try again.");
        }
    };

    if (loading) return <div className="edit-stock-container">Loading...</div>;

    return (
        <div className="edit-stock-container">
            <div className="edit-stock-card">
                <h2>Edit Medicine Stock</h2>
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
                            disabled // Usually we don't change the medicine itself in an edit stock record? Only qty/price? 
                        // If the user WANTS to change medicine, they can, but it might be weird. 
                        // For now, I'll leave it enabled unless logic dictates otherwise. 
                        // Actually, standard practice for stock records is often to NOT change the item reference, but let's keep it flexible if the backend allows.
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
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Purchase Price</label>
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
                        />
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
                            Update Stock
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

export default EditStock;
