import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, getSpecializations } from "../../api/api";
import "./AddDoctor.css";

const AddDoctor = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        fullName: "",
        gender: "",
        joiningDate: "",
        mobileNumber: "",
        consultationFee: "",
        availability: "",
        specializationId: ""
    });

    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const navigate = useNavigate();

    // ---------------- Fetch Specializations ----------------
    useEffect(() => {
        const fetchSpecs = async () => {
            try {
                const res = await getSpecializations();
                setSpecializations(res.data);
            } catch (err) {
                console.error("Error fetching specializations:", err);
                setErrorMsg("Unable to load specializations.");
            }
        };
        fetchSpecs();
    }, []);

    // ---------------- Handle Input Change ----------------
    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // ---------------- Validation ----------------
    const validateForm = () => {
        if (form.username.trim().length < 3) return "Username must be at least 3 characters.";
        if (form.password.length < 6) return "Password must be at least 6 characters.";
        if (!form.fullName.trim()) return "Full name is required.";
        if (!form.gender) return "Select a gender.";
        if (!/^[0-9]{10}$/.test(form.mobileNumber)) return "Mobile number must be 10 digits.";
        if (!form.joiningDate) return "Joining date is required.";
        if (Number(form.consultationFee) <= 0) return "Consultation fee must be positive.";
        if (!form.specializationId) return "Select specialization.";
        return null;
    };

    // ---------------- Submit Form ----------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        const error = validateForm();
        if (error) {
            setErrorMsg(error);
            return;
        }

        const payload = {
            username: form.username.trim(),
            password: form.password,
            role: "Doctor",
            full_name: form.fullName.trim(),
            gender: form.gender,
            joining_date: form.joiningDate,
            mobile_number: form.mobileNumber,
            consultation_fee: Number(form.consultationFee),
            availability: form.availability.trim(),
            specialization: Number(form.specializationId),
        };

        setLoading(true);

        try {
            await registerUser(payload);
            setSuccessMsg("Doctor added successfully!");
            setTimeout(() => navigate("/admindashboard"), 1200);
        } catch (error) {
            console.error("Error adding doctor:", error);
            setErrorMsg(error?.response?.data?.detail || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Add Doctor Button */}
            <button
                className="add-corner-btn"
                onClick={() => navigate("/add-doctor")}
            >
                Add Doctor
            </button>

            <div className="container">
                <div className="card">
                    <h2>Add Doctor</h2>

                    {/* Alerts */}
                    {errorMsg && <div className="alert alert-error">{errorMsg}</div>}
                    {successMsg && <div className="alert alert-success">{successMsg}</div>}

                    <form onSubmit={handleSubmit}>
                        
                        {/* Username & Password */}
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.username}
                                    onChange={(e) => updateField("username", e.target.value)}
                                />
                            </div>

                            <div className="col-md-6 form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Name & Gender */}
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.fullName}
                                    onChange={(e) => updateField("fullName", e.target.value)}
                                />
                            </div>

                            <div className="col-md-6 form-group">
                                <label className="form-label">Gender</label>
                                <select
                                    className="form-control"
                                    value={form.gender}
                                    onChange={(e) => updateField("gender", e.target.value)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Mobile & Joining Date */}
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label className="form-label">Mobile Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={form.mobileNumber}
                                    onChange={(e) => updateField("mobileNumber", e.target.value)}
                                />
                            </div>

                            <div className="col-md-6 form-group">
                                <label className="form-label">Joining Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={form.joiningDate}
                                    onChange={(e) => updateField("joiningDate", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Fee & Availability */}
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label className="form-label">Consultation Fee</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={form.consultationFee}
                                    onChange={(e) => updateField("consultationFee", e.target.value)}
                                />
                            </div>

                            <div className="col-md-6 form-group">
                                <label className="form-label">Availability</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., Mon–Fri"
                                    value={form.availability}
                                    onChange={(e) => updateField("availability", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Specialization */}
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label className="form-label">Specialization</label>
                                <select
                                    className="form-control"
                                    value={form.specializationId}
                                    onChange={(e) => updateField("specializationId", e.target.value)}
                                >
                                    <option value="">Select Specialization</option>
                                    {specializations.map((spec) => (
                                        <option key={spec.spec_Id} value={spec.spec_Id}>
                                            {spec.specialization_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className={`btn btn-primary w-100 ${loading ? "btn-loading" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Doctor"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddDoctor;
