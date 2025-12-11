import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    createPharmacistBill,
    getPendingPrescriptions,
    getMedicines,
    getMedicineStock,
} from "../../api/api";
import "./CreateBill.css";



const CreateBill = () => {
    const { consultationId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Data sources
    const [patientName, setPatientName] = useState("");
    const [consultationDetails, setConsultationDetails] = useState(null);
    const [generatedBill, setGeneratedBill] = useState(null); // Stores the response from backend

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            if (consultationId) {
                const pendingRes = await getPendingPrescriptions();
                const consultation = pendingRes.data.find(
                    (c) => String(c.Consultation_id || c.consultation_id || c.id) === String(consultationId)
                );

                if (consultation) {
                    setPatientName(consultation.patient_name || consultation.patient?.name || "Unknown Patient");
                    setConsultationDetails(consultation);
                } else {
                    setError("Consultation not found in pending list.");
                }
            }
        } catch (err) {
            console.error("Error loading data:", err);
            const msg = err.response?.data?.detail || err.message || JSON.stringify(err);
            setError(`Failed to load initial data: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateBill = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                consultation_id: parseInt(consultationId)
            };

            const response = await createPharmacistBill(payload);
            setGeneratedBill(response.data);
            alert("Bill Generated Successfully!");
        } catch (err) {
            console.error("Create bill error:", err);
            let errMsg = "Failed to create bill.";
            if (err.response && err.response.data) {
                errMsg = JSON.stringify(err.response.data);
            }
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    // View: Bill Generated Successfully
    if (generatedBill) {
        return (
            <div className="create-bill-container">
                <div className="bill-card">
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <h2 style={{ color: "#10b981" }}>Bill Generated Successfully</h2>
                        <p>Bill ID: #{generatedBill.bill_id}</p>
                        <p>Total: ${generatedBill.total_amount}</p>
                    </div>

                    <div className="items-section">
                        <h3>Items Billed</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f3f4f6" }}>
                                    <th style={{ padding: "8px", textAlign: "left" }}>Medicine</th>
                                    <th style={{ padding: "8px", textAlign: "right" }}>Qty</th>
                                    <th style={{ padding: "8px", textAlign: "right" }}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generatedBill.items && generatedBill.items.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                        <td style={{ padding: "8px" }}>{item.medicine}</td>
                                        <td style={{ padding: "8px", textAlign: "right" }}>{item.qty}</td>
                                        <td style={{ padding: "8px", textAlign: "right" }}>{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="form-actions" style={{ marginTop: "20px" }}>
                        <button className="submit-btn" onClick={() => navigate("/pharmacist/bills")}>
                            View All Bills
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // View: Confirmation Screen
    return (
        <div className="create-bill-container">
            <div className="bill-card">
                <h2>Generate Bill (Auto-Calculation)</h2>
                {error && <div className="error-message">{error}</div>}

                <div className="bill-header-info">
                    <div className="info-group">
                        <label>Date:</label>
                        <span>{today}</span>
                    </div>
                    {patientName && (
                        <div className="info-group">
                            <label>Patient:</label>
                            <span className="patient-name">{patientName}</span>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: "2rem", marginBottom: "2rem", padding: "1rem", backgroundColor: "#eff6ff", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                    <p style={{ margin: 0, color: "#1e40af" }}>
                        <strong>Note:</strong> Clicking "Generate Bill" will automatically calculate quantities based on the Doctor's prescription (Frequency × Duration), deduct from stock, and finalize the bill.
                    </p>
                </div>

                <div className="form-actions">
                    <button
                        onClick={handleGenerateBill}
                        className="submit-btn"
                        disabled={loading || !consultationDetails}
                    >
                        {loading ? "Processing..." : "GENERATE BILL NOW"}
                    </button>
                    <button
                        className="cancel-btn"
                        onClick={() => navigate('/pharmacist/pending-bills')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBill;


