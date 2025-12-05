import React, { useEffect, useState } from "react";
import { getAllPatients } from "../../api/api";

const Dashboard = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await getAllPatients();
                setPatients(res.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>
            <h3>Registered Patients</h3>

            <table
                style={{
                    width: "100%",
                    marginTop: "20px",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>DOB</th>
                        <th style={thStyle}>Blood Group</th>
                        <th style={thStyle}>Gender</th>
                        <th style={thStyle}>Phone</th>
                    </tr>
                </thead>

                <tbody>
                    {patients.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                                No patients available
                            </td>
                        </tr>
                    ) : (
                        patients.map((p) => (
                            <tr key={p.id}>
                                <td style={tdStyle}>{p.id}</td>
                                <td style={tdStyle}>{p.patient_name}</td>
                                <td style={tdStyle}>{p.email}</td>
                                <td style={tdStyle}>{p.date_of_birth}</td>
                                <td style={tdStyle}>{p.blood_group}</td>
                                <td style={tdStyle}>{p.gender}</td>
                                <td style={tdStyle}>{p.phone}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const thStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    fontWeight: "bold",
};

const tdStyle = {
    border: "1px solid #ddd",
    padding: "8px",
};

export default Dashboard;
