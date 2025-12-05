import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdminUser } from "../../api/api";  // Correct path

const User = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Doctor");
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [consultationFee, setConsultationFee] = useState("");
    const [designation, setDesignation] = useState("");
    const [availability, setAvailability] = useState("");
    const [specialization, setSpecialization] = useState("");

    const navigate = useNavigate();

    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                username,
                password,
                role,
                full_name: fullName,
                gender,
                joining_date: joiningDate,
                mobile_number: mobileNumber,
                consultation_fee: consultationFee,
                designation,
                availability,
                specialization: Number(specialization),
            };

            await registerAdminUser(payload);

            alert("User created successfully!");
            navigate("/admin-dashboard");

        } catch (err) {
            console.log("User Creation Error :", err.response?.data);
            alert("Failed to create user");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create User</h2>

            <form onSubmit={handleCreateUser} className="mt-3">

                <label className="form-label">Username</label>
                <input
                    type="text"
                    className="form-control mb-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control mb-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label className="form-label">Role</label>
                <select
                    className="form-control mb-3"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Receptionist">Receptionist</option>
                </select>

                <label className="form-label">Full Name</label>
                <input
                    type="text"
                    className="form-control mb-3"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <label className="form-label">Gender</label>
                <select
                    className="form-control mb-3"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label className="form-label">Joining Date</label>
                <input
                    type="date"
                    className="form-control mb-3"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                />

                <label className="form-label">Mobile Number</label>
                <input
                    type="text"
                    className="form-control mb-3"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                />

                <label className="form-label">Consultation Fee</label>
                <input
                    type="number"
                    className="form-control mb-3"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                />

                <label className="form-label">Designation</label>
                <input
                    type="text"
                    className="form-control mb-3"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                />

                <label className="form-label">Availability</label>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Mon-Fri"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                />

                <label className="form-label">Specialization (ID)</label>
                <input
                    type="number"
                    className="form-control mb-3"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                />

                <button type="submit" className="btn btn-primary w-100">
                    Create User
                </button>
            </form>
        </div>
    );
};

export default User;
        