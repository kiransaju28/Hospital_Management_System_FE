import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLabBills, deleteLabBill, getPatients } from "../../../api/api";
import "../List.css";

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [patientMap, setPatientMap] = useState({});

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchBills();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm]);

    // Fetch patients to map IDs to Names
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            // Fetch a large page size to get most/all patients for mapping
            const res = await getPatients({ page_size: 1000 });
            const data = res.data.results ?? res.data;
            const map = {};
            if (Array.isArray(data)) {
                data.forEach(p => {
                    const id = p.Patient_id || p.id;
                    if (id) {
                        map[id] = p.patient_name || p.name || "Unknown";
                    }
                });
            }
            setPatientMap(map);
        } catch (err) {
            console.error("Failed to fetch patients for mapping:", err);
        }
    };

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

    const getPatientName = (bill) => {
        if (bill.patient_name) return bill.patient_name;
        if (bill.patient && patientMap[bill.patient]) return patientMap[bill.patient];
        if (bill.patient?.patient_name) return bill.patient.patient_name;
        return `Patient ID: ${bill.patient}`;
    };

    const calculateBillTotal = (bill) => {
        // Use backend total if available and non-zero
        const total = parseFloat(bill.total_amount);
        if (total > 0) return total;

        // Fallback: Calculate from items if present
        if (bill.items && Array.isArray(bill.items)) {
            return bill.items.reduce((sum, item) => {
                const itemTotal = parseFloat(item.subtotal) || parseFloat(item.price) || 0;
                return sum + itemTotal;
            }, 0);
        }

        return 0;
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
                                        <td>{getPatientName(bill)}</td>
                                        <td>{new Date(bill.bill_date).toLocaleDateString()}</td>
                                        <td>₹{calculateBillTotal(bill).toFixed(2)}</td>
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
