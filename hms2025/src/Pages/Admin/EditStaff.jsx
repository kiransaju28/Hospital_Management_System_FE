import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStaffById, updateStaff } from "../../api/api";
import './EditStaff.css';
const EditStaff = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        full_name: "",
        role: "",
        gender: "",
        joining_date: "",
        mobile_number: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaffMember = async () => {
            try {
                const res = await getStaffById(id);
                const member = res.data;

                setFormData({
                    username: member.username || "",
                    full_name: member.full_name || "",
                    role: member.role || "",
                    gender: member.gender || "",
                    joining_date: member.joining_date || "",
                    mobile_number: member.mobile_number || "",
                });
            } catch (err) {
                console.error("Error loading staff member:", err);
                alert("Failed to load staff details");
            } finally {
                setLoading(false);
            }
        };

        fetchStaffMember();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload
            const payload = {
                full_name: formData.full_name,
                gender: formData.gender,
                joining_date: formData.joining_date,
                mobile_number: formData.mobile_number,
                // Role is typically read-only or handled via specific admin functions, 
                // but if editable, include it here. Assuming read-only for now based on typical flows.
            };

            await updateStaff(id, payload);
            alert("Staff member updated successfully");
            navigate("/staff");
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update staff member");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <h3>Edit Staff</h3>
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

                {/* Read-only Role */}
                <div className="mb-3">
                    <label>Role</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.role}
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

                <button type="submit" className="btn btn-primary">Update Staff</button>
            </form>
        </div>
    );
};

export default EditStaff;
