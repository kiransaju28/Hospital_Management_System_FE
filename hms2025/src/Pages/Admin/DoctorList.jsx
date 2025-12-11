import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctors, deleteDoctor, getSpecializations } from "../../api/api";
import "./DoctorList.css";

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchSpecializations();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchDoctors();
        }, 300); // Debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm]);

    const fetchSpecializations = async () => {
        try {
            const res = await getSpecializations();
            // Create a map of ID -> Name for easy lookup
            const specMap = {};
            res.data.forEach(spec => {
                specMap[spec.spec_Id] = spec.specialization_name;
            });
            setSpecializations(specMap);
        } catch (err) {
            console.error("Error fetching specializations:", err);
        }
    };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = { page, page_size: pageSize };
            if (searchTerm) params.search = searchTerm;

            const res = await getDoctors(params);

            const data = res.data.results ?? res.data;
            setDoctors(data);

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
        const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
        if (!confirmDelete) {
            return;
        }
        try {
            await deleteDoctor(id);
            alert("Doctor deleted successfully");
            fetchDoctors();
        } catch (err) {
            console.error(err);
            alert("Failed to delete doctor");
        }
    };

    const getSpecializationName = (doctor) => {
        return specializations[doctor.specialization] ||
               doctor.specialization?.specialization_name ||
               doctor.specialization_name ||
               "N/A";
    };

    const formatFee = (fee) => {
        if (!fee) return "N/A";
        return `₹${parseFloat(fee).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getAvailabilityBadge = (availability) => {
        const avail = (availability || "").toLowerCase();
        if (avail === "available") return "status-available";
        if (avail === "busy") return "status-busy";
        if (avail === "on leave") return "status-leave";
        return "status-unknown";
    };

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Doctors</h2>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name, specialization..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div>
                    <button className="refresh-btn" onClick={fetchDoctors}>
                        Refresh
                    </button>
                    <Link to="/add-doctor" className="btn btn-success">
                        Add Doctor
                    </Link>
                </div>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="loading-state">Loading doctors...</div>
                ) : (
                    <>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>DOCTOR ID</th>
                                    <th>NAME</th>
                                    <th>GENDER</th>
                                    <th>SPECIALIZATION</th>
                                    <th>AVAILABILITY</th>
                                    <th>FEE</th>
                                    <th>CONTACT</th>
                                    <th>JOINING DATE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {doctors.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            No doctors found
                                        </td>
                                    </tr>
                                ) : (
                                    doctors.map((doc) => (
                                        <tr key={doc.doctor_id}>
                                            <td className="doctor-id">
                                                #{doc.doctor_id}
                                            </td>
                                            <td className="doctor-name">
                                                <div className="name-wrapper">
                                                    <div className="doctor-fullname">
                                                        {doc.staff?.full_name ?? "Unknown"}
                                                    </div>
                                                    <div className="doctor-username">
                                                        @{doc.staff?.username ?? "N/A"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="doctor-gender">
                                                {doc.staff?.gender ?? "N/A"}
                                            </td>
                                            <td className="doctor-specialization">
                                                <span className="specialization-badge">
                                                    {getSpecializationName(doc)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${getAvailabilityBadge(doc.availability)}`}>
                                                    {doc.availability || "N/A"}
                                                </span>
                                            </td>
                                            <td className="doctor-fee">
                                                {formatFee(doc.consultation_fee)}
                                            </td>
                                            <td className="doctor-contact">
                                                {doc.staff?.mobile_number ?? "N/A"}
                                            </td>
                                            <td className="doctor-joining">
                                                {formatDate(doc.staff?.joining_date)}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/edit-doctor/${doc.doctor_id}`}
                                                    className="btn-edit"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(doc.doctor_id)}
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
                                Showing {doctors.length} of {totalCount} doctors
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

export default DoctorList;