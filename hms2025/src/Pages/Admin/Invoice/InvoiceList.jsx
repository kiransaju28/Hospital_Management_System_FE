import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBills, deleteBill, getPatients } from "../../../api/api";
import "../List.css";

const InvoiceList = () => {
    const [bills, setBills] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const res = await getBills();
            const data = res.data.results || res.data;
            setBills(data);

            const patRes = await getPatients({ page_size: 1000 });
            setPatients(patRes.data.results || patRes.data);
        } catch (err) {
            console.error("Error fetching invoices:", err);
        } finally {
            setLoading(false);
        }
    };

    const getPatientName = (id) => {
        if (!id) return "N/A";
        if (typeof id === 'object') return id.patient_name || "Unknown";
        const p = patients.find(pat => pat.Patient_id === id || pat.id === id);
        return p ? p.patient_name : id;
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this invoice?")) return;
        try {
            await deleteBill(id);
            alert("Invoice deleted successfully");
            fetchBills();
        } catch (err) {
            console.error("Error deleting invoice:", err);
            alert("Failed to delete invoice");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Invoice Management</h3>
                <Link to="/admin/create-invoice" className="btn btn-success">Generate Invoice</Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Patient</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">No invoices found</td>
                            </tr>
                        ) : (
                            bills.map((bill) => (
                                <tr key={bill.ConsultationBill_id || bill.id}>
                                    <td>{bill.ConsultationBill_id || bill.id}</td>
                                    <td>{getPatientName(bill.patient)}</td>
                                    <td>₹{bill.amount}</td>
                                    <td>{bill.bill_date ? new Date(bill.bill_date).toLocaleDateString() : "N/A"}</td>
                                    <td>
                                        <Link
                                            to={`/admin/view-invoice/${bill.ConsultationBill_id || bill.id}`}
                                            className="btn btn-sm btn-info me-2"
                                        >
                                            View / PDF
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(bill.ConsultationBill_id || bill.id)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InvoiceList;
