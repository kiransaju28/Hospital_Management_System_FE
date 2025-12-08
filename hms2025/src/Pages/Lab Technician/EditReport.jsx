import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getLabReportById,
    updateLabReport,
    // We might need to update individual results or the whole block?
    // Using `updateLabReport` only updates report fields (remarks).
    // Updating results usually requires iterating or a special bulk update endpoint.
    // For simplicity, we will assume we can't edit individual result values easily without a bulk endpoint
    // OR we assume we might not need full edit capability right now since the User just asked for "View". 
    // But "Edit Report" was in the file list.
    // I'll implement basic Edit for Remarks for now. 
    // Implementing editable results is complex without a bulk-update serializer.
} from "../../api/api";
import "./EditReport.css";

const EditReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getLabReportById(id);
                setRemarks(res.data.remarks || "");
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateLabReport(id, { remarks });
            alert("Report updated");
            navigate("/lab-test-orders"); // or view report
        } catch (err) {
            console.error("Update error:", err);
            if (err.response && err.response.data) {
                alert("Update failed: " + JSON.stringify(err.response.data));
            } else {
                alert("Update failed");
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2>Edit Report</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Remarks</label>
                        <textarea
                            className="form-control"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        </div>
    );
};

export default EditReport;
