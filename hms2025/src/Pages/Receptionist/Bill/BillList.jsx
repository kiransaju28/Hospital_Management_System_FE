import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBills, deleteBill, getPatients } from "../../../api/api";
import "../../Admin/List.css";

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

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

            const res = await getBills(params);
            const data = res.data.results || res.data;
            setBills(data);

            if (res.data.count) {
                setTotalCount(res.data.count);
                setTotalPages(Math.ceil(res.data.count / pageSize));
            } else {
                setTotalCount(data.length);
                setTotalPages(1);
            }

            const patRes = await getPatients({ page_size: 1000 });
            setPatients(patRes.data.results || patRes.data);
        } catch (err) {
            console.error("Error fetching bills:", err);
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
        if (!window.confirm("Are you sure you want to delete this bill?")) return;
        try {
            await deleteBill(id);
            alert("Bill deleted successfully");
            fetchBills();
        } catch (err) {
            console.error("Error deleting bill:", err);
            alert("Failed to delete bill");
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Consultation Bills</h2>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by patient name or bill ID..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div>
                    <button className="refresh-btn" onClick={fetchBills}>
                        Refresh
                    </button>
                    <Link to="/receptionist/create-bill" className="btn btn-success">
                        Generate Bill
                    </Link>
                </div>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading consultation bills...</div>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>BILL ID</th>
                                    <th>PATIENT</th>
                                    <th>AMOUNT</th>
                                    <th>DATE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No consultation bills found
                                        </td>
                                    </tr>
                                ) : (
                                    bills.map((bill) => (
                                        <tr key={bill.ConsultationBill_id || bill.id}>
                                            <td className="bill-id">
                                                #{bill.ConsultationBill_id || bill.id}
                                            </td>
                                            <td className="patient-name">
                                                {getPatientName(bill.patient)}
                                            </td>
                                            <td className="bill-amount">
                                                {formatAmount(bill.amount)}
                                            </td>
                                            <td className="bill-date">
                                                {formatDate(bill.bill_date)}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${bill.payment_status === 'paid' ? 'status-paid' : 'status-pending'}`}>
                                                    {bill.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/receptionist/view-bill/${bill.ConsultationBill_id || bill.id}`}
                                                    className="btn-view"
                                                >
                                                    View / PDF
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(bill.ConsultationBill_id || bill.id)}
                                                    className="btn-delete"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="pagination-container">
                            <div className="pagination-info">
                                Showing {bills.length} of {totalCount} bills
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className="pagination-btn"
                                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                >
                                    ← Previous
                                </button>
                                <div className="page-indicator">
                                    Page {page} of {totalPages}
                                </div>
                                <button
                                    className="pagination-btn"
                                    onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                    disabled={page === totalPages}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BillList;