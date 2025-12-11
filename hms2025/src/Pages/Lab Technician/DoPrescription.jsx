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
    const [totalCount, setTotalCount] = useState(0);

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
            const params = { page, page_size: pageSize, status: "Pending" };
            if (searchTerm) params.search = searchTerm;

            const res = await getLabTechTestOrders(params);

            const data = res.data.results ?? res.data;
            const pendingOrders = Array.isArray(data) ? data.filter(order => order.status === "Pending") : [];
            setOrders(pendingOrders);

            if (res.data.count) {
                setTotalCount(res.data.count);
                setTotalPages(Math.ceil(res.data.count / pageSize));
            } else {
                setTotalCount(data.length);
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

    const getPatientName = (order) => {
        // Try different possible field names for patient name
        return order.patient_name || 
               order.patient?.patient_name || 
               order.consultation?.appointment?.patient?.patient_name || 
               "Patient Info";
    };

    const getTestName = (order) => {
        return order.test_name || 
               order.test?.category_name || 
               order.lab_test_category?.category_name || 
               "N/A";
    };

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Pending Lab Test Orders</h2>
                <div className="search-box">
                    
                </div>
                <div>
                    <button className="refresh-btn" onClick={fetchOrders}>
                        Refresh
                    </button>
                    <Link to="/lab-bills" className="btn btn-warning">
                        Lab Bills
                    </Link>
                    <Link to="/lab-reports" className="btn btn-info ms-2">
                        View Report History
                    </Link>
                </div>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading orders...</div>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ORDER ID</th>
                                    <th>TEST NAME</th>
                                    <th>PATIENT NAME</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
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
                                            <td className="order-id">
                                                #{order.lab_test_order_id}
                                            </td>
                                            <td className="test-name">
                                                {getTestName(order)}
                                            </td>
                                            <td className="patient-name">
                                                {getPatientName(order)}
                                            </td>
                                            <td>
                                                <span className="status-badge status-pending">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/view-prescription/${order.lab_test_order_id}`}
                                                    className="btn-view"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleComplete(order.lab_test_order_id)}
                                                    className="btn-success"
                                                >
                                                    Complete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="pagination-container">
                            <div className="pagination-info">
                                Showing {orders.length} of {totalCount} orders
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

export default DoPrescription;