import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient } from "../../api/api";
import "./AddPatient.css"; // Reuse existing CSS

const AddPatient = () => {
    const [formData, setFormData] = useState({
        patient_name: "",
        email: "",
        date_of_birth: "",
        blood_group: "",
        gender: "",
        address: "",
        phone: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPatient(formData);
            alert("Patient registered successfully!");
            navigate("/patients");
        } catch (err) {
            console.error("Error registering patient:", err);
            // show backend validation if present
            if (err.response && err.response.data) {
                let errorMsg = "Failed to register patient:\n";
                const data = err.response.data;

                const formatErrors = (obj, prefix = '') => {
                    let msg = '';
                    if (typeof obj === 'string') {
                        return `${prefix}${obj}\n`;
                    }
                    if (Array.isArray(obj)) {
                        return obj.map(m => `${prefix}- ${m}\n`).join('');
                    }
                    if (typeof obj === 'object' && obj !== null) {
                        for (let [key, val] of Object.entries(obj)) {
                            msg += formatErrors(val, `${prefix}${key}: `);
                        }
                    }
                    return msg;
                };

                errorMsg += formatErrors(data);
                alert(errorMsg);
            } else {
                alert("Failed to register patient. Please try again.");
            }
        }
    };

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Register New Patient</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Patient Name</label>
                        <input
                            type="text"
                            name="patient_name"
                            value={formData.patient_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Blood Group</label>
                        <select
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select
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

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            rows="3"
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn">Register Patient</button>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;
