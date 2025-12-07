import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLabBills, deleteLabBill } from "../../../api/api";
import "../List.css";

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchBills();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm]);

    const fetchBills = async () => {
        setLoading(true);
        try {
            const params = { page, page_size: pageSize };
            if (searchTerm) params.search = searchTerm;

            const res = await getLabBills(params);
            const data = res.data.results ?? res.data;
            setBills(data);

            if (res.data.count) {
                setTotalPages(Math.ceil(res.data.count / pageSize));
            } else {
                setTotalPages(1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this bill?")) return;

        try {
            await deleteLabBill(id);
            alert("Bill deleted successfully");
            fetchBills();
        } catch (err) {
            console.error(err);
            alert("Failed to delete bill");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <h3>Lab Bills</h3>
                <Link to="/create-bill" className="btn btn-success">
                    Create New Bill
                </Link>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by patient name or bill ID..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                }}
            />

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Bill ID</th>
                                <th>Patient Name</th>
                                <th>Bill Date</th>
                                <th>Total Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bills.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No bills found
                                    </td>
                                </tr>
                            ) : (
                                bills.map((bill) => (
                                    <tr key={bill.LabBill_id}>
                                        <td>{bill.LabBill_id}</td>
                                        <td>{bill.patient_name || `Patient ID: ${bill.patient}`}</td>
                                        <td>{new Date(bill.bill_date).toLocaleDateString()}</td>
                                        <td>₹{parseFloat(bill.total_amount).toFixed(2)}</td>
                                        <td>
                                            <Link
                                                to={`/view-bill/${bill.LabBill_id}`}
                                                className="btn btn-sm btn-info me-2"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(bill.LabBill_id)}
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

                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        <span className="pagination-info">Page {page} of {totalPages}</span>
                        <button
                            className="btn btn-outline-primary ms-2"
                            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BillList;
