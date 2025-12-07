import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLabTechTestOrderById } from "../../api/api";
import "./Add.css"; // Reuse the card styling

const ViewPrescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await getLabTechTestOrderById(id);
                setOrder(res.data);
            } catch (err) {
                console.error("Error fetching order:", err);
                alert("Failed to fetch order details");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="mb-4">Lab Test Order Details</h2>

                <div className="mb-3">
                    <strong>Order ID:</strong> {order.lab_test_order_id}
                </div>
                <div className="mb-3">
                    <strong>Test Name:</strong> {order.test_name || order.test?.category_name || "N/A"}
                </div>
                <div className="mb-3">
                    <strong>Status:</strong> {order.status}
                </div>

                {/* Add more fields here as needed (Patient info, Doctor info, etc.) */}

                <div className="mt-4">
                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    {order.status === "Pending" && (
                        <button
                            className="btn btn-success"
                            onClick={() => navigate(`/add-report/${order.lab_test_order_id}`)}
                        >
                            Complete & Add Report
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewPrescription;
