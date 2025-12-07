import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLabTechTestOrders, updateLabTechTestOrderStatus } from "../../api/api";
import "./List.css";

const DoPrescription = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        // Debounce search
        const delayDebounce = setTimeout(() => {
            fetchOrders();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Filter by "Pending" status by default or handle in backend if implied
            // The user requested to see "lab prescriptions" (orders).
            // Usually Lab Tech wants to see Pending ones to act on them.
            const params = { page, page_size: pageSize, status: "Pending" };
            if (searchTerm) params.search = searchTerm;

            const res = await getLabTechTestOrders(params);

            const data = res.data.results ?? res.data;
            // Client-side filter to ensure only Pending orders are shown
            // as backend filter might not be enabled.
            const pendingOrders = Array.isArray(data) ? data.filter(order => order.status === "Pending") : [];
            setOrders(pendingOrders);

            if (res.data.count) {
                // If filtering client-side, totalPages based on server count might be misleading 
                // but we can't easily fix pagination without backend filter. 
                // For now, we accept this limitation or assume filtering works.
                // Better to set totalPages based on filtered length if no server pagination, 
                // but usually server pagination exists.
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

    const handleComplete = async (orderId) => {
        // Redirect to Add Report page
        navigate(`/add-report/${orderId}`);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3 align-items-center">
                <h3>Pending Lab Test Orders</h3>
                <div>
                    <Link to="/lab-bills" className="btn btn-warning text-white me-2">
                        Lab Bills
                    </Link>
                    <Link to="/lab-reports" className="btn btn-info text-white">
                        View Report History
                    </Link>
                </div>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search..."
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
                                <th>Order ID</th>
                                <th>Test Name</th>
                                <th>Patient Name</th> {/* Backend serializer needs to provide this or nested consult->appt->patient */}
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No pending orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.lab_test_order_id}>
                                        <td>{order.lab_test_order_id}</td>
                                        {/* Adjust fields based on actual serializer output */}
                                        <td>{order.test_name || order.test?.category_name || "N/A"}</td>
                                        <td>
                                            {/* Nested lookup might be deep: order.consultation?.appointment?.patient?.full_name */}
                                            {/* Ideally the serializer flattens this. I will assume some basic info is there or displayed as ID for now if not. */}
                                            {order.patient_name || "Patient Info"}
                                        </td>
                                        <td>
                                            <span className="badge bg-warning text-dark">{order.status}</span>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/view-prescription/${order.lab_test_order_id}`}
                                                className="btn btn-sm btn-info me-2"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleComplete(order.lab_test_order_id)}
                                                className="btn btn-sm btn-success"
                                            >
                                                Complete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
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

export default DoPrescription;
