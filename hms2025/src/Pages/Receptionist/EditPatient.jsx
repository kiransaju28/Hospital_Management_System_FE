import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPatientById, updatePatient } from "../../api/api";
import "../Admin/add.css";

const EditPatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        patient_name: "",
        email: "",
        date_of_birth: "",
        blood_group: "",
        gender: "",
        address: "",
        phone: "",
    });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await getPatientById(id);
                const data = res.data;

                setFormData({
                    patient_name: data.patient_name ?? "",
                    email: data.email ?? "",
                    date_of_birth: data.date_of_birth ?? "",
                    blood_group: data.blood_group ?? "",
                    gender: data.gender ?? "",
                    address: data.address ?? "",
                    phone: data.phone ?? "",
                });
            } catch (err) {
                console.error("Error fetching patient:", err);
                alert("Failed to load patient details");
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updatePatient(id, formData);
            alert("Patient updated successfully!");
            navigate("/patients");
        } catch (err) {
            console.error("Error updating patient:", err);
            if (err.response && err.response.data) {
                let errorMsg = "Failed to update patient:\n";
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
                alert("Failed to update patient");
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="add-container">
            <div className="add-card">
                <h2>Edit Patient</h2>

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
                            <option value="">Select</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
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
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
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
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn">Update Patient</button>
                </form>
            </div>
        </div>
    );
};

export default EditPatient;
