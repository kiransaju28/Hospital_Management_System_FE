import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getLabReportById,
    getLabReportResults
} from "../../api/api";
import "./Add.css";

const ViewReport = () => {
    // Note: We might access this via ReportID or OrderID. 
    // Assuming route /view-report/:id comes with ReportID. 
    // If not, we'd need to fetch report by OrderID.
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Report
                const reportRes = await getLabReportById(id);
                setReport(reportRes.data);

                // 2. Fetch Results for this report
                // Since `results` are a nested field or related name, the serializer *might* include them.
                // The serializer `LabReportSerializer` in prompt had `results = LabReportResultSerializer(many=True)`.
                // So `reportRes.data.results` should exist!
                if (reportRes.data.results) {
                    setResults(reportRes.data.results);
                } else {
                    // Fallback if not nested (though it should be)
                    const resultsRes = await getLabReportResults({ report: id });
                    setResults(resultsRes.data.results ?? resultsRes.data);
                }

            } catch (err) {
                console.error("Error loading report:", err);
                alert("Failed to load report");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!report) return <div>Report not found</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Lab Report Details</h2>
                    <span className="text-muted">{report.report_date}</span>
                </div>

                <div className="mb-4">
                    <h5>Category: {report.category_name}</h5>
                    <p><strong>Remarks:</strong> {report.remarks || "None"}</p>
                </div>

                <h5 className="mb-3">Results</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                            <th>Normal Range</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length === 0 ? (
                            <tr><td colSpan="3">No results recorded.</td></tr>
                        ) : (
                            results.map(res => (
                                <tr key={res.LabReportResult_id}>
                                    <td>{res.parameter_name}</td>
                                    <td>{res.value}</td>
                                    <td>{res.normal_range}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default ViewReport;
