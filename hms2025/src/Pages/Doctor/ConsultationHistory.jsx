import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getConsultations, getPrescriptionItems, getLabTestOrders } from "../../api/api";
import "../Admin/list.css"; // Reuse existing list styles

const ConsultationHistory = () => {
    const navigate = useNavigate();
    const [consultations, setConsultations] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [consRes, prescRes, labRes] = await Promise.all([
                getConsultations(),
                getPrescriptionItems(),
                getLabTestOrders()
            ]);

            setConsultations(consRes.data.results || consRes.data);
            setPrescriptions(prescRes.data.results || prescRes.data);
            setLabTests(labRes.data.results || labRes.data);
        } catch (err) {
            console.error("Error fetching history data:", err);
            setError("Failed to load full history.");
        } finally {
            setLoading(false);
        }
    };

    const getConsultationPrescriptions = (consultationId) => {
        return prescriptions.filter(p =>
            (p.consultation === consultationId) ||
            (p.consultation?.id === consultationId)
        );
    };

    const getConsultationLabTests = (consultationId) => {
        return labTests.filter(t =>
            (t.consultation === consultationId) ||
            (t.consultation?.id === consultationId)
        );
    };

    if (loading) return <div className="loading">Loading history...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="list-container">
            <div className="list-header">
                <h2>Consultation History</h2>
                <button className="refresh-btn" onClick={fetchAllData}>
                    Refresh
                </button>
            </div>

            <div className="table-wrapper">
                {consultations.length === 0 ? (
                    <p className="no-data">No past consultations found.</p>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date/ID</th>
                                <th>Details</th>
                                <th>Prescriptions</th>
                                <th>Lab Tests</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultations.map((consultation) => {
                                const id = consultation.consultation_id || consultation.id;
                                const relatedPrescriptions = getConsultationPrescriptions(id);
                                const relatedTests = getConsultationLabTests(id);

                                return (
                                    <tr key={id}>
                                        <td>
                                            <strong>ID: {id}</strong><br />
                                            <span style={{ fontSize: '0.85em', color: '#666' }}>
                                                {new Date(consultation.created_at || Date.now()).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ marginBottom: '5px' }}><strong>Symp:</strong> {consultation.symptoms}</div>
                                            <div style={{ marginBottom: '5px' }}><strong>Diag:</strong> {consultation.diagnosis}</div>
                                            {/* Action to Add More */}
                                            <div style={{ marginTop: '10px' }}>
                                                <button className="btn-small" onClick={() => navigate(`/doctor/add-prescription/${id}`)} style={{ marginRight: '5px' }}>+ Rx</button>
                                                <button className="btn-small" onClick={() => navigate(`/doctor/add-lab-test/${id}`)}>+ Lab</button>
                                            </div>
                                        </td>
                                        <td>
                                            {relatedPrescriptions.length === 0 ? "-" : (
                                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                    {relatedPrescriptions.map(p => {
                                                        const pId = p.id || p.prescription_id || p.Prescription_id;
                                                        return (
                                                            <li key={pId} style={{ marginBottom: '5px' }}>
                                                                {p.medicine_name || p.medicine?.medicine_name || p.medicine} ({p.dosage})
                                                                <button
                                                                    style={{ marginLeft: '10px', fontSize: '0.8em', cursor: 'pointer', color: 'blue', border: 'none', background: 'none', textDecoration: 'underline' }}
                                                                    onClick={() => navigate(`/doctor/edit-prescription/${pId}`)}
                                                                >
                                                                    Edit
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </td>
                                        <td>
                                            {relatedTests.length === 0 ? "-" : (
                                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                    {relatedTests.map(t => {
                                                        const tId = t.id || t.lab_test_id || t.labtest_id || t.LabTest_id;
                                                        return (
                                                            <li key={tId} style={{ marginBottom: '5px' }}>
                                                                {t.test_name || t.test?.test_name || t.test}
                                                                <button
                                                                    style={{ marginLeft: '10px', fontSize: '0.8em', cursor: 'pointer', color: 'blue', border: 'none', background: 'none', textDecoration: 'underline' }}
                                                                    onClick={() => navigate(`/doctor/edit-lab-test/${tId}`)}
                                                                >
                                                                    Edit
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ConsultationHistory;
