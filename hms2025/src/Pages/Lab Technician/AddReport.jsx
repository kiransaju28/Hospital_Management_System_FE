import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getLabTechTestOrderById,
    getTestParameters,
    createLabReport,
    createLabReportResult,
    updateLabTechTestOrderStatus
} from "../../api/api";
import "./Add.css";

const AddReport = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [parameters, setParameters] = useState([]);
    const [results, setResults] = useState({}); // { parameter_id: value }
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Fetch Order details
                const orderRes = await getLabTechTestOrderById(orderId);
                const orderData = orderRes.data;
                setOrder(orderData);

                // 2. Fetch Parameters for the Test Category
                const categoryId = typeof orderData.test === 'object' ? orderData.test.LabTestCategory_id : orderData.test;

                if (categoryId) {
                    const paramsRes = await getTestParameters({ category: categoryId });
                    const paramsData = paramsRes.data.results ?? paramsRes.data;

                    // Client-side filter
                    const filteredParams = paramsData.filter(p => p.category === categoryId || p.category?.LabTestCategory_id === categoryId);

                    setParameters(filteredParams);

                    const initialResults = {};
                    filteredParams.forEach(p => {
                        initialResults[p.LabTestParameter_id] = "";
                    });
                    setResults(initialResults);
                }

            } catch (err) {
                console.error("Error loading data:", err);
                alert("Failed to load requisite data for report");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) init();
    }, [orderId]);

    const handleResultChange = (paramId, value) => {
        setResults(prev => ({ ...prev, [paramId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!order) return;

        try {
            const categoryId = typeof order.test === 'object' ? order.test.LabTestCategory_id : order.test;

            // 1. Create Report
            const reportPayload = {
                order: orderId,
                category: categoryId,
                remarks: remarks
            };
            const reportRes = await createLabReport(reportPayload);
            const newReportId = reportRes.data.LabReport_id;

            // 2. Create Results
            await Promise.all(
                parameters.map(param =>
                    createLabReportResult({
                        report: newReportId,
                        parameter: param.LabTestParameter_id,
                        value: results[param.LabTestParameter_id]
                    })
                )
            );

            // 3. Update Order Status to "Completed"
            await updateLabTechTestOrderStatus(orderId, { status: "Completed" });

            alert("Report created successfully!");
            navigate("/lab-test-orders");

        } catch (err) {
            console.error("Error creating report:", err);
            if (err.response && err.response.data) {
                console.error("Server Error Details:", err.response.data);
                alert("Failed to create report: " + JSON.stringify(err.response.data));
            } else {
                alert("Failed to create report. Please try again.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">Add Lab Report</h2>

                <div className="mb-4 p-3 bg-light rounded">
                    <h5>Order Details</h5>
                    <p><strong>Test:</strong> {order.test_name}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <h5 className="mb-3">Test Results</h5>
                    {parameters.length === 0 ? (
                        <p className="text-muted">No specific parameters defined for this test.</p>
                    ) : (
                        parameters.map(param => (
                            <div className="mb-3 row" key={param.LabTestParameter_id}>
                                <label className="col-sm-4 col-form-label">
                                    {param.label} <small className="text-muted">({param.normal_range})</small>
                                </label>
                                <div className="col-sm-8">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        value={results[param.LabTestParameter_id] || ""}
                                        onChange={(e) => handleResultChange(param.LabTestParameter_id, e.target.value)}
                                        required
                                        placeholder="Enter numeric value"
                                    />
                                </div>
                            </div>
                        ))
                    )}

                    <div className="mb-3 mt-4">
                        <label className="form-label">Remarks / Notes</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Submit Report & Complete Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddReport;
