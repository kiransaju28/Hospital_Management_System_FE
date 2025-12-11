import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getDoctorById,
    updateDoctor,
    getSpecializations,
    updateStaff,
} from "../../api/api";
import "./EditDoctor.css";

const EditDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [staffId, setStaffId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [specializations, setSpecializations] = useState([]);

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

    // ---------------- Fetch Doctor Data & Specializations ----------------
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const specRes = await getSpecializations();
                setSpecializations(specRes.data);

                const docRes = await getDoctorById(id);
                const doc = docRes.data;

                setStaffId(doc.staff?.staff_id);

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
                console.error(err);
                alert("Failed to load doctor details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id]);

    // ---------------- Handle Input Change ----------------
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // ---------------- Save Updates ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!staffId) {
            alert("Staff ID missing.");
            return;
        }

        try {
            const staffPayload = {
                full_name: formData.full_name,
                gender: formData.gender,
                joining_date: formData.joining_date,
                mobile_number: formData.mobile_number,
            };

            const doctorPayload = {
                consultation_fee: formData.consultation_fee,
                availability: formData.availability,
                specialization: formData.specialization,
            };

            await updateStaff(staffId, staffPayload);
            await updateDoctor(id, doctorPayload);

            alert("Doctor updated successfully!");
            navigate("/doctors");
        } catch (err) {
            console.error(err);
            alert("Failed to update doctor.");
        }
    };

    if (loading) return <div className="loading-text">Loading…</div>;

    return (
        <div className="container">
            <div className="edit-card">
                <h2 className="edit-title">Edit Doctor</h2>

                <form onSubmit={handleSubmit}>

                    {/* Username (Read-only) */}
                    <div className="form-row">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.username}
                            disabled
                            readOnly
                        />
                    </div>

                    {/* Full Name */}
                    <div className="form-row">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            className="form-control"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Gender */}
                    <div className="form-row">
                        <label className="form-label">Gender</label>
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

                    {/* Joining Date */}
                    <div className="form-row">
                        <label className="form-label">Joining Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="joining_date"
                            value={formData.joining_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="form-row">
                        <label className="form-label">Mobile Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Consultation Fee */}
                    <div className="form-row">
                        <label className="form-label">Consultation Fee</label>
                        <input
                            type="number"
                            className="form-control"
                            name="consultation_fee"
                            value={formData.consultation_fee}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Availability */}
                    <div className="form-row">
                        <label className="form-label">Availability</label>
                        <input
                            type="text"
                            className="form-control"
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                            placeholder="e.g., Mon–Fri"
                        />
                    </div>

                    {/* Specialization */}
                    <div className="form-row">
                        <label className="form-label">Specialization</label>
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

                    {/* Update Button */}
                    <button type="submit" className="btn btn-primary">
                        Update Doctor
                    </button>

                </form>
            </div>
        </div>
    );
};

export default EditDoctor;
