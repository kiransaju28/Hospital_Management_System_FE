import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStaff, deleteStaff } from "../../api/api";
import "./StaffList.css";

const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getRoleBadgeClass = (role) => {
        const roleLower = (role || "").toLowerCase();
        if (roleLower.includes('admin')) return 'role-admin';
        if (roleLower.includes('doctor')) return 'role-doctor';
        if (roleLower.includes('nurse')) return 'role-nurse';
        if (roleLower.includes('receptionist')) return 'role-receptionist';
        if (roleLower.includes('pharmacist')) return 'role-pharmacist';
        if (roleLower.includes('technician')) return 'role-technician';
        return 'role-staff';
    };

    const getGenderIcon = (gender) => {
        const genderLower = (gender || "").toLowerCase();
        if (genderLower === 'male') return '👨';
        if (genderLower === 'female') return '👩';
        return '👤';
    };

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Staff Members</h2>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name, role..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div>
                    <button className="refresh-btn" onClick={fetchStaff}>
                        Refresh
                    </button>
                    <Link to="/add-staff" className="btn btn-success">
                        Add Staff
                    </Link>
                </div>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading staff members...</div>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>STAFF ID</th>
                                    <th>NAME</th>
                                    <th>ROLE</th>
                                    <th>GENDER</th>
                                    <th>CONTACT</th>
                                    <th>JOINING DATE</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {staff.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            No staff members found
                                        </td>
                                    </tr>
                                ) : (
                                    staff.map((member) => (
                                        <tr key={member.staff_id}>
                                            <td className="staff-id">
                                                #{member.staff_id}
                                            </td>
                                            <td className="staff-name">
                                                <div className="name-wrapper">
                                                    <div className="staff-fullname">
                                                        {member.full_name ?? "Unknown"}
                                                    </div>
                                                    <div className="staff-username">
                                                        @{member.username ?? "N/A"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`role-badge ${getRoleBadgeClass(member.role)}`}>
                                                    {member.role ?? "Staff"}
                                                </span>
                                            </td>
                                            <td className="staff-gender">
                                                <span className="gender-icon">
                                                    {getGenderIcon(member.gender)}
                                                </span>
                                                <span className="gender-text">
                                                    {member.gender ?? "N/A"}
                                                </span>
                                            </td>
                                            <td className="staff-contact">
                                                {member.mobile_number ?? "N/A"}
                                            </td>
                                            <td className="staff-joining">
                                                {formatDate(member.joining_date)}
                                            </td>
                                            <td>
                                                <span className={`status-badge ${member.is_active ? 'status-active' : 'status-inactive'}`}>
                                                    {member.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/edit-staff/${member.staff_id}`}
                                                    className="btn-edit"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member.staff_id)}
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
                                Showing {staff.length} of {totalCount} staff members
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

export default StaffList;