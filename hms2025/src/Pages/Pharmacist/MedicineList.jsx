import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMedicines, deleteMedicine } from "../../api/api";
// import "./List.css"; // Assuming we can reuse similar styles or the file might need to be created/imported if specific styles are needed, but for now standard bootstrap classes

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchMedicines();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [page, searchTerm]);

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const params = { page, page_size: pageSize };
            if (searchTerm) params.search = searchTerm;

            const res = await getMedicines(params);

            // Handle different potential response structures (DRF pagination vs flat list)
            const data = res.data.results ?? res.data;
            setMedicines(data);

            if (res.data.count) {
                setTotalPages(Math.ceil(res.data.count / pageSize));
            } else {
                setTotalPages(1); // Default if no count provided
            }
        } catch (err) {
            console.error("Error fetching medicines:", err);
            // alert("Error fetching medicines");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this medicine?");
        if (!confirmDelete) return;

        try {
            await deleteMedicine(id);
            alert("Medicine deleted successfully");
            fetchMedicines();
        } catch (err) {
            console.error(err);
            alert("Failed to delete medicine");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3>Medicine Inventory</h3>
                <Link to="/add-medicine" className="btn btn-success">Add Medicine</Link>
            </div>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by medicine name..."
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
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Medicine Name</th>
                                <th>Manufacturer</th>
                                <th>Dosage</th>
                                <th>Stock</th>
                                <th>Price (Per Unit)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No medicines found</td>
                                </tr>
                            ) : (
                                medicines.map((med) => (
                                    <tr key={med.Medicine_id}>
                                        <td>{med.medicine_name}</td>
                                        <td>{med.manufacture_name}</td>
                                        <td>{med.dosage}</td>
                                        <td>{med.quantity_in_stock}</td>
                                        <td>{med.price_per_unit}</td>
                                        <td>
                                            <Link
                                                to={`/edit-medicine/${med.Medicine_id}`}
                                                className="btn btn-sm btn-primary me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(med.Medicine_id)}
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
                    <div className="d-flex justify-content-center align-items-center mt-3">
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

export default MedicineList;
