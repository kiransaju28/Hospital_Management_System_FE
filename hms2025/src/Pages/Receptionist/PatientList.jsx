import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients, deletePatient } from "../../api/api";
import "./PatientList.css"; // Reuse existing CSS

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
        <div className="list-container">
            <div className="list-header">
                <h2>Patients</h2>
                <div className="search-box">
                    
                </div>
                <div>
                    <button className="refresh-btn" onClick={fetchPatients}>
                        Refresh
                    </button>
                    <Link to="/appointments" className="btn btn-primary me-2">
                        Appointments
                    </Link>
                    <Link to="/add-patient" className="btn btn-success">
                        Add Patient
                    </Link>
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>PHONE</th>
                                    <th>GENDER</th>
                                    <th>BLOOD GROUP</th>
                                    <th>DOB</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No patients found
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient) => (
                                        <tr key={patient.Patient_id ?? patient.id}>
                                            <td>{patient.patient_name}</td>
                                            <td>{patient.email}</td>
                                            <td>{patient.phone}</td>
                                            <td>{patient.gender}</td>
                                            <td>{patient.blood_group}</td>
                                            <td>{patient.date_of_birth}</td>
                                            <td>
                                                <Link
                                                    to={`/edit-patient/${patient.Patient_id ?? patient.id}`}
                                                    className="btn-edit"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(patient.Patient_id ?? patient.id)}
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
                    </div>

                    <div className="pagination-container">
                        <div className="pagination-info">
                            Page {page} of {totalPages}
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                            >
                                PREVIOUS
                            </button>
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                NEXT
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PatientList;