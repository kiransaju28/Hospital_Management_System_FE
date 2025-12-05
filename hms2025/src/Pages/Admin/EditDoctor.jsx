import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctorById, updateDoctor, getSpecializations } from "../../api/api";

const EditDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        full_name: "",
        gender: "",
        joining_date: "",
        mobile_number: "",
        consultation_fee: "",
        availability: "",
        specialization: "",
    });

    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch specializations
                const specRes = await getSpecializations();
                setSpecializations(specRes.data);

                // Fetch doctor details
                const docRes = await getDoctorById(id);
                const doc = docRes.data;

                // Populate form data
                // Note: Adjust fields based on actual API response structure
                setFormData({
                    username: doc.staff?.username || "",
                    full_name: doc.staff?.full_name || "",
                    gender: doc.staff?.gender || "",
                    joining_date: doc.staff?.joining_date || "",
                    mobile_number: doc.staff?.mobile_number || "",
                    consultation_fee: doc.consultation_fee || "",
                    availability: doc.availability || "",
                    specialization: doc.specialization || "",
                });
            } catch (err) {
                console.error("Error loading data:", err);
                alert("Failed to load doctor details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload - only send editable fields
            // Assuming username is read-only or handled separately if needed
            const payload = {
                full_name: formData.full_name,
                gender: formData.gender,
                joining_date: formData.joining_date,
                mobile_number: formData.mobile_number,
                consultation_fee: formData.consultation_fee,
                availability: formData.availability,
                specialization: formData.specialization,
            };

            await updateDoctor(id, payload);
            alert("Doctor updated successfully");
            navigate("/doctors");
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update doctor");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <h3>Edit Doctor</h3>
            <form onSubmit={handleSubmit} className="mt-3">
                {/* Read-only Username */}
                <div className="mb-3">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.username}
                        readOnly
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label>Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Gender</label>
                    <select
                        className="form-control"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Joining Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="joining_date"
                        value={formData.joining_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Mobile Number</label>
                    <input
                        type="text"
                        className="form-control"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Consultation Fee</label>
                    <input
                        type="number"
                        className="form-control"
                        name="consultation_fee"
                        value={formData.consultation_fee}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Availability</label>
                    <input
                        type="text"
                        className="form-control"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Specialization</label>
                    <select
                        className="form-control"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Specialization</option>
                        {specializations.map((spec) => (
                            <option key={spec.spec_Id} value={spec.spec_Id}>
                                {spec.specialization_name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Update Doctor</button>
            </form>
        </div>
    );
};

export default EditDoctor;
