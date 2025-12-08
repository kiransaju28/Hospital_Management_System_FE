import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLabReportById, getLabReportResults } from "../../../api/api";
import "../../Lab Technician/Add.css";

const ViewLabReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Lab Report
                const reportRes = await getLabReportById(id);
                setReport(reportRes.data);

                // Fetch Results - check if nested in report or fetch separately
                if (reportRes.data.results) {
                    setResults(reportRes.data.results);
                } else {
                    const resultsRes = await getLabReportResults({ report: id });
                    setResults(resultsRes.data.results ?? resultsRes.data);
                }
            } catch (err) {
                console.error("Error loading lab report:", err);
                setError("Failed to load lab report");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="loading">Loading lab report...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!report) return <div className="error-message">Report not found</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Lab Report</h2>
                    <span className="badge bg-info text-white">
                        {new Date(report.report_date).toLocaleDateString()}
                    </span>
                </div>

                <div className="mb-4">
                    <div className="row">
                        <div className="col-md-6">
                            <p>
                                <strong>Patient: </strong>
                                <Link to="/doctor/patients" style={{ textDecoration: 'none', color: '#007bff' }}>
                                    {report.order?.patient_name || report.order?.patient?.name || report.patient_name || "Unknown"}
                                </Link>
                            </p>
                            <p><strong>Report ID:</strong> {report.LabReport_id || report.id}</p>
                            <p><strong>Test Category:</strong> {report.category_name || "N/A"}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Order ID:</strong> {report.order?.LabTestOrder_id || report.order?.id || report.order || "N/A"}</p>
                            <p><strong>Status:</strong> <span className="badge bg-success">Completed</span></p>
                        </div>
                    </div>
                </div>

                {report.remarks && (
                    <div className="alert alert-info mb-4">
                        <strong>Remarks:</strong> {report.remarks}
                    </div>
                )}

                <h5 className="mb-3">Test Results</h5>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Parameter</th>
                                <th>Value</th>
                                <th>Normal Range</th>
                                <th>Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">
                                        No results recorded
                                    </td>
                                </tr>
                            ) : (
                                results.map((res) => (
                                    <tr key={res.LabReportResult_id || res.id}>
                                        <td><strong>{res.parameter_name || res.parameter?.label || "N/A"}</strong></td>
                                        <td>{res.value}</td>
                                        <td>{res.normal_range || "N/A"}</td>
                                        <td>{res.unit || "N/A"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4">
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        ← Back to Consultation History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewLabReport;
