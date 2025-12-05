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

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            username: username,
            password: password,
            role: role,
            full_name: fullName,
            gender: gender,
            joining_date: joiningDate,
            mobile_number: mobileNumber
        };

        try {
            await registerUser(payload);
            alert("Staff Added Successfully");
            navigate("/dashboard"); // Or /staff if that route exists
        } catch (error) {
            console.error("Error adding staff:", error.response?.data);
            alert("Error adding Staff: " + (error.response?.data?.detail || "Unknown error"));
        }
    };

    return (
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

                            <button type="submit" className="btn btn-primary w-100 mt-3">
                                Add Staff
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStaff;