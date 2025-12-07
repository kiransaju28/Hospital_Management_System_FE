import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/api";
// This imports the entire CSS file and applies its styles
import './add.css';

const AddStaff = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Receptionist"); // Default to Receptionist
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!username.trim() || username.trim().length < 3) {
            alert("Username must be at least 3 characters");
            return false;
        }
        if (!password || password.length < 6) {
            alert("Password must be at least 6 characters");
            return false;
        }
        if (!fullName.trim()) {
            alert("Full name is required");
            return false;
        }
        if (!gender) {
            alert("Please select a gender");
            return false;
        }
        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            alert("Enter a valid 10-digit mobile number");
            return false;
        }
        if (!joiningDate) {
            alert("Joining date is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const payload = {
            username: username.trim(),
            password: password,
            role: role,
            full_name: fullName.trim(),
            gender: gender,
            joining_date: joiningDate,
            mobile_number: mobileNumber
        };

        setLoading(true);
        try {
            await registerUser(payload);
            alert("Staff added successfully");
            navigate("/admindashboard"); // back to admin dashboard
        } catch (error) {
            console.error("Error adding staff:", error?.response?.data || error);
            const msg = error?.response?.data?.detail || error?.message || "Unknown error";
            alert("Error adding staff: " + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Add Staff Button - Top Left Corner */}
            <button 
                className="btn add-corner-btn add-staff-corner"
                onClick={() => navigate('/add-staff')}
                style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}
            >
                Add Staff
            </button>
            
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow p-4">
                            <h2 className="text-center mb-4">Add Staff</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Username */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Role */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Role</label>
                                        <select
                                            className="form-control"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                        >
                                            <option value="Receptionist">Receptionist</option>
                                            <option value="Pharmacist">Pharmacist</option>
                                            <option value="LabTechnician">Lab Technician</option>
                                            {/* Add other staff roles if needed */}
                                        </select>
                                    </div>

                                    {/* Full Name */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Gender */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Gender</label>
                                        <select
                                            className="form-control"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Mobile Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    {/* Joining Date */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Joining Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={joiningDate}
                                            onChange={(e) => setJoiningDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading}>
                                    {loading ? 'Adding...' : 'Add Staff'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddStaff;