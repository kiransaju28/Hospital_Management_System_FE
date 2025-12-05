import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients, deletePatient } from "../../api/api";
import "../Admin/List.css"; // Reuse existing CSS

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchPatients();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const params = { page, page_size: pageSize };
            if (searchTerm) params.search = searchTerm;

            const res = await getPatients(params);
            const data = res.data.results ?? res.data;
            setPatients(data);

            if (res.data.count) {
                setTotalPages(Math.ceil(res.data.count / pageSize));
            } else {
                setTotalPages(1);
            }
        } catch (err) {
            console.error("Error fetching patients:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) return;
        try {
            await deletePatient(id);
            alert("Patient deleted successfully");
            fetchPatients();
        } catch (err) {
            console.error("Error deleting patient:", err);
            alert("Failed to delete patient");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Patients</h3>
                <Link to="/add-patient" className="btn btn-success">Add Patient</Link>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by name, phone..."
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>Blood Group</th>
                                <th>DOB</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">No patients found</td>
                                </tr>
                            ) : (
                                patients.map((patient) => (
                                    <tr key={patient.Patient_id || patient.id}>
                                        <td>{patient.patient_name}</td>
                                        <td>{patient.email}</td>
                                        <td>{patient.phone}</td>
                                        <td>{patient.gender}</td>
                                        <td>{patient.blood_group}</td>
                                        <td>{patient.date_of_birth}</td>
                                        <td>
                                            <Link
                                                to={`/edit-patient/${patient.Patient_id || patient.id}`}
                                                className="btn btn-sm btn-primary me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(patient.Patient_id || patient.id)}
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

export default PatientList;
