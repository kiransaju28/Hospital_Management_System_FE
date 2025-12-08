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
                setTotalPages(Math.ceil(res.data.count / pageSize));
            } else {
                setTotalPages(1);
            }
        } catch (err) {
            console.error(err);
            // alert("Error fetching tests");
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
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Lab Tests</h3>
                <Link to="/add-test" className="btn btn-success">Add Test</Link>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by category name..."
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
                                <th>Category ID</th>
                                <th>Category Name</th>
                                <th>Actions</th>
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
                                        <td>{test.LabTestCategory_id}</td>
                                        <td>{test.category_name}</td>
                                        <td>
                                            <Link
                                                to={`/edit-test/${test.LabTestCategory_id}`}
                                                className="btn btn-sm btn-primary me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(test.LabTestCategory_id)}
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

                    {/* Pagination */}
                    <div className="d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>

                        <span>Page {page} of {totalPages}</span>

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

export default TestList;
