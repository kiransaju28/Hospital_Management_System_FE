import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLabReports } from "../../api/api";
import "./ReportList.css";

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

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
                <h2>Lab Report History</h2>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by category or ID..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div>
                    <button className="refresh-btn" onClick={fetchReports}>
                        Refresh
                    </button>
                    <Link to="/lab-test-orders" className="btn btn-secondary">
                        Back to Orders
                    </Link>
                </div>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading reports...</div>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>REPORT ID</th>
                                    <th>CATEGORY</th>
                                    <th>REPORT DATE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No reports found
                                        </td>
                                    </tr>
                                ) : (
                                    reports.map((report) => (
                                        <tr key={report.LabReport_id}>
                                            <td className="report-id">
                                                #{report.LabReport_id}
                                            </td>
                                            <td className="report-category">
                                                {report.category_name}
                                            </td>
                                            <td className="report-date">
                                                {formatDate(report.report_date)}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${report.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                                                    {report.status === 'completed' ? 'Completed' : 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/view-report/${report.LabReport_id}`}
                                                    className="btn-view"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`/edit-report/${report.LabReport_id}`}
                                                    className="btn-edit"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="pagination-container">
                            <div className="pagination-info">
                                Showing {reports.length} of {totalCount} reports
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

export default ReportList;