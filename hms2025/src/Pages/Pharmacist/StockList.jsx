import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMedicineStock, deleteMedicineStock } from "../../api/api";
import "./StockList.css";

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await getMedicineStock();
            setStocks(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching stocks:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this stock entry?")) {
            try {
                await deleteMedicineStock(id);
                setStocks(stocks.filter(stock => stock.MedicineStock_id !== id));
            } catch (error) {
                console.error("Error deleting stock:", error);
                alert("Failed to delete stock. Please try again.");
            }
        }
    };

    const filteredStocks = stocks.filter((stock) =>
        stock.medicine_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading stock...</div>;

    return (
        <div className="stock-list-container">
            <div className="stock-header">
                <h1>Medicine Stock Inventory</h1>
                <Link to="/pharmacist/add-stock" className="add-stock-btn">
                    + Add Stock
                </Link>
            </div>

            <div className="stock-search">
                <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="stock-table-wrapper">
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Medicine Name</th>
                            <th>Quantity</th>
                            <th>Purchase Price</th>
                            <th>Reorder Level</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStocks.length > 0 ? (
                            filteredStocks.map((stock) => (
                                <tr key={stock.MedicineStock_id}>
                                    <td>{stock.MedicineStock_id}</td>
                                    <td>{stock.medicine_name}</td>
                                    <td>{stock.quantity || stock.quantity_in_stock}</td>
                                    <td>{Number(stock.purchase_price).toFixed(2)}</td>
                                    <td>
                                        <span
                                            className={`reorder-level ${(stock.quantity || stock.quantity_in_stock) <= stock.Reorder_level ? "critical" : ""
                                                }`}
                                        >
                                            {stock.Reorder_level}
                                        </span>
                                    </td>
                                    <td>{stock.Created_Date}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                to={`/pharmacist/edit-stock/${stock.MedicineStock_id}`}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(stock.MedicineStock_id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    No stock entries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockList;
