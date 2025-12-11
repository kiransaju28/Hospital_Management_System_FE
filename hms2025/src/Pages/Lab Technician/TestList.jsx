import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTestCategories, deleteTestCategory } from "../../api/api";
import "./TestList.css";

const TestList = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchTests();
        }, 300); // Debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm]);

    const fetchTests = async () => {
        setLoading(true);
        try {
            const params = { page, page_size: pageSize };
            if (searchTerm) params.search = searchTerm;

            const res = await getTestCategories(params);

            const data = res.data.results ?? res.data;
            setTests(data);

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

    //Delete handler function
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this test category?");
        if (!confirmDelete) {
            return;
        }
        try {
            await deleteTestCategory(id);
            alert("Test Category deleted successfully");
            fetchTests();
        } catch (err) {
            console.error(err);
            alert("Failed to delete test category");
        }
    };

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Lab Tests</h2>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by category name..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div>
                    <button className="refresh-btn" onClick={fetchTests}>
                        Refresh
                    </button>
                    <Link to="/add-test" className="btn btn-success">
                        Add Test
                    </Link>
                </div>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading tests...</div>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>CATEGORY ID</th>
                                    <th>CATEGORY NAME</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tests.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            No tests found
                                        </td>
                                    </tr>
                                ) : (
                                    tests.map((test) => (
                                        <tr key={test.LabTestCategory_id}>
                                            <td className="test-id">
                                                #{test.LabTestCategory_id}
                                            </td>
                                            <td className="test-name">
                                                {test.category_name}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/edit-test/${test.LabTestCategory_id}`}
                                                    className="btn-edit"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(test.LabTestCategory_id)}
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
                                Showing {tests.length} of {totalCount} tests
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

export default TestList;