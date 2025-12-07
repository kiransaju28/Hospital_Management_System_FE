import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabBillById } from "../../../api/api";
import "../Add.css";

const ViewBill = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const res = await getLabBillById(id);
                setBill(res.data);
            } catch (err) {
                console.error("Error fetching bill:", err);
                alert("Failed to fetch bill details");
            } finally {
                setLoading(false);
            }
        };
        fetchBill();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!bill) return <div>Bill not found</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Lab Bill Details</h2>
                    <span className="badge bg-success">Bill #{bill.LabBill_id}</span>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <p><strong>Patient:</strong> {bill.patient_name || `Patient ID: ${bill.patient}`}</p>
                        <p><strong>Bill Date:</strong> {new Date(bill.bill_date).toLocaleDateString()}</p>
                    </div>
                    <div className="col-md-6 text-end">
                        <h4>Total: ₹{parseFloat(bill.total_amount).toFixed(2)}</h4>
                    </div>
                </div>

                <h5 className="mb-3">Bill Items</h5>
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Test Category</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bill.items && bill.items.length > 0 ? (
                            bill.items.map((item, index) => (
                                <tr key={item.LabBillItem_id || index}>
                                    <td>{item.test_name || item.test?.category_name || "N/A"}</td>
                                    <td>₹{parseFloat(item.price).toFixed(2)}</td>
                                    <td>₹{parseFloat(item.subtotal).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No items found</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="table-info">
                            <td colSpan="2" className="text-end"><strong>Total Amount:</strong></td>
                            <td><strong>₹{parseFloat(bill.total_amount).toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>

                <button className="btn btn-secondary mt-3" onClick={() => navigate("/lab-bills")}>
                    ← Back to Bills
                </button>
            </div>
        </div>
    );
};

export default ViewBill;
