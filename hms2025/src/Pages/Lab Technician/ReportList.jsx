import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLabReports } from "../../api/api";
import "./List.css";

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchReports();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = { page, page_size: pageSize };
            if (searchTerm) params.search = searchTerm;

            const res = await getLabReports(params);
            const data = res.data.results ?? res.data;
            setReports(data);

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

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Lab Report History</h3>
                <Link to="/lab-test-orders" className="btn btn-secondary">Back to Orders</Link>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search report..."
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
                                <th>Report ID</th>
                                <th>Category</th>
                                <th>Report Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No reports found
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.LabReport_id}>
                                        <td>{report.LabReport_id}</td>
                                        <td>{report.category_name}</td>
                                        <td>{report.report_date}</td>
                                        <td>
                                            <Link
                                                to={`/view-report/${report.LabReport_id}`}
                                                className="btn btn-sm btn-info me-2"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                to={`/edit-report/${report.LabReport_id}`}
                                                className="btn btn-sm btn-primary"
                                            >
                                                Edit
                                            </Link>
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

export default ReportList;
