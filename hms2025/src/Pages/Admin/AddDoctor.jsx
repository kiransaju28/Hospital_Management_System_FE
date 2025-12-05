import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, getSpecializations } from "../../api/api";
// This imports the entire CSS file and applies its styles
import './add.css';

const AddDoctor = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [consultationFee, setConsultationFee] = useState("");
    const [availability, setAvailability] = useState("");
    const [specializationId, setSpecializationId] = useState("");
    const [specializations, setSpecializations] = useState([]);

    const navigate = useNavigate();

    // Fetch specializations
    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const res = await getSpecializations();
                setSpecializations(res.data);
            } catch (err) {
                console.error("Error fetching specializations:", err);
                // Optional: alert("Error fetching specializations");
            }
        };
        fetchSpecializations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            username: username,
            password: password,
            role: "Doctor",
            full_name: fullName,
            gender: gender,
            joining_date: joiningDate,
            mobile_number: mobileNumber,
            consultation_fee: Number(consultationFee),
            availability: availability,
            specialization: Number(specializationId)
        };

        try {
            await registerUser(payload);
            alert("Doctor Added Successfully");
            navigate("/dashboard"); // Or /doctors if that route exists
        } catch (error) {
            console.error("Error adding doctor:", error.response?.data);
            alert("Error adding Doctor: " + (error.response?.data?.detail || "Unknown error"));
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-4">Add Doctor</h2>

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
                            </div>

                            <div className="row">
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

                            <div className="row">
                                {/* Consultation Fee */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Consultation Fee</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={consultationFee}
                                        onChange={(e) => setConsultationFee(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Availability */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Availability</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g., Mon-Fri"
                                        value={availability}
                                        onChange={(e) => setAvailability(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                {/* Specialization */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Specialization</label>
                                    <select
                                        className="form-control"
                                        value={specializationId}
                                        onChange={(e) => setSpecializationId(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Specialization</option>
                                        {specializations.map((spec) => (
                                            <option key={spec.spec_Id} value={spec.spec_Id}>
                                                {spec.specialization_name}
                                            </option>
                                        ))}
                                    </select>
                                    {specializations.length === 0 && (
                                        <small className="text-muted">
                                            If list is empty, enter ID manually below if needed.
                                        </small>
                                    )}
                                </div>
                            </div>

                            {/* Manual Specialization ID Input (Fallback) */}
                            {specializations.length === 0 && (
                                <div className="mb-3">
                                    <label className="form-label">Specialization ID (Manual)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={specializationId}
                                        onChange={(e) => setSpecializationId(e.target.value)}
                                    />
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary w-100 mt-3">
                                Add Doctor
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDoctor;