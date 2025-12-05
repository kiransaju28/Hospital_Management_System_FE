import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStaff, deleteStaff } from "../../api/api";

const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchStaff();
        }, 300); // Debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm]);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const params = { page, page_size: pageSize };
            if (searchTerm) params.search = searchTerm;

            const res = await getStaff(params);

            const data = res.data.results ?? res.data;
            setStaff(data);

            if (res.data.count) {
                setTotalPages(Math.ceil(res.data.count / pageSize));
            } else {
                setTotalPages(1);
            }
        } catch (err) {
            console.error(err);
            // alert("Error fetching staff");
        } finally {
            setLoading(false);
        }
    };

    //Delete handler function
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this staff member?");
        if (!confirmDelete) {
            return;
        }
        try {
            await deleteStaff(id);
            alert("Staff member deleted successfully");
            fetchStaff();
        } catch (err) {
            console.error(err);
            alert("Failed to delete staff member");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Staff</h3>
                <Link to="/add-staff" className="btn btn-success">Add Staff</Link>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by name, role..."
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
                                <th>Username</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Gender</th>
                                <th>Contact</th>
                                <th>Joining Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No staff found
                                    </td>
                                </tr>
                            ) : (
                                staff.map((member) => (
                                    <tr key={member.staff_id}>
                                        <td>{member.username ?? "N/A"}</td>
                                        <td>{member.full_name ?? "Unknown"}</td>
                                        <td>{member.role ?? "N/A"}</td>
                                        <td>{member.gender ?? "N/A"}</td>
                                        <td>{member.mobile_number ?? "N/A"}</td>
                                        <td>{member.joining_date ?? "N/A"}</td>
                                        <td>
                                            <Link
                                                to={`/edit-staff/${member.staff_id}`}
                                                className="btn btn-sm btn-primary me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(member.staff_id)}
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

export default StaffList;
