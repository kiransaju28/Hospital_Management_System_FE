import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPendingPrescriptions } from "../../api/api";
import "./PendingBills.css";

const PendingBills = () => {
    const navigate = useNavigate();
    const [pendings, setPendings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const response = await getPendingPrescriptions();
            setPendings(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching pending prescriptions", err);
            setError("Failed to load pending prescriptions.");
            setLoading(false);
        }
    };

    const handleCreateBill = (consultationId) => {
        navigate(`/pharmacist/create-bill/${consultationId}`);
    };

    if (loading) return <div className="loading">Loading pending prescriptions...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="pending-bills-container">
            <div className="pending-header">
                <h1>Pending Prescriptions</h1>
                <p>Select a prescription to generate a bill.</p>
            </div>

            <div className="pending-list">
                {pendings.length > 0 ? (
                    pendings.map((item) => (
                        <div key={item.Consultation_id || item.consultation_id || item.id} className="pending-card">
                            <div className="pending-info">
                                <h3>{item.patient_name}</h3>
                                <div className="pending-meta">
                                    <span>Date: {item.consultation_date}</span>
                                    <span>Doctor: {item.doctor_name}</span>
                                </div>
                            </div>
                            <button
                                className="create-bill-btn"
                                onClick={() => handleCreateBill(item.Consultation_id || item.consultation_id || item.id)}
                            >
                                Generate Bill
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-data-message">
                        <p>No pending prescriptions found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingBills;
