import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBillById, getAppointmentById, getPatientById, getDoctorById } from "../../../api/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ViewInvoice = () => {
    const { id } = useParams();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({
        patientName: "",
        doctorName: "",
        appointmentDate: "",
        specialization: ""
    });

    useEffect(() => {
        const fetchBillDetails = async () => {
            try {
                const res = await getBillById(id);
                setBill(res.data);

                // Fetch related details
                // Assuming bill.appointment is an ID. If object, use directly.
                const aptId = typeof res.data.appointment === 'object' ? res.data.appointment.Appointment_id : res.data.appointment;
                const patId = typeof res.data.patient === 'object' ? res.data.patient.Patient_id : res.data.patient;

                // Fetch Appointment to get Doctor
                let docId = null;
                let aptDate = "";
                let docName = "";
                let spec = "";

                if (aptId) {
                    const aptRes = await getAppointmentById(aptId);
                    const apt = aptRes.data;
                    aptDate = apt.appointment_date;
                    docId = typeof apt.doctor === 'object' ? apt.doctor.doctor_id : apt.doctor;
                }

                if (docId) {
                    const docRes = await getDoctorById(docId);
                    const doc = docRes.data;
                    docName = doc.staff?.full_name || doc.full_name;
                    spec = doc.specialization?.specialization_name || doc.specialization_name || "";
                }

                // Fetch Patient
                let patName = "";
                if (patId) {
                    const patRes = await getPatientById(patId);
                    patName = patRes.data.patient_name;
                }

                setDetails({
                    patientName: patName,
                    doctorName: docName,
                    appointmentDate: aptDate,
                    specialization: spec
                });

            } catch (err) {
                console.error("Error fetching invoice details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBillDetails();
    }, [id]);

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text("Hospital Management System", 105, 20, { align: "center" });
        doc.setFontSize(16);
        doc.text("Invoice", 105, 30, { align: "center" });

        // Invoice Info
        doc.setFontSize(12);
        doc.text(`Invoice ID: ${bill.ConsultationBill_id || bill.id}`, 14, 50);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 50);

        // Patient & Doctor Info
        doc.text(`Patient Name: ${details.patientName}`, 14, 60);
        doc.text(`Doctor Name: Dr. ${details.doctorName}`, 14, 70);
        doc.text(`Specialization: ${details.specialization}`, 14, 80);

        // Table for Items
        doc.autoTable({
            startY: 90,
            head: [['Description', 'Amount']],
            body: [
                ['Consultation Fee', `Rs. ${bill.amount}`]
            ],
        });

        const finalY = doc.lastAutoTable.finalY || 100;

        // Total
        doc.text(`Total Amount: Rs. ${bill.amount}`, 140, finalY + 10);

        doc.save(`Invoice_${bill.ConsultationBill_id || bill.id}.pdf`);
    };

    if (loading) return <div>Loading...</div>;
    if (!bill) return <div>Invoice not found</div>;

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h3>Invoice Details</h3>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <h5>Client Details</h5>
                            <p><strong>Name:</strong> {details.patientName}</p>
                            <p><strong>Appointment Date:</strong> {details.appointmentDate ? new Date(details.appointmentDate).toLocaleString() : "N/A"}</p>
                        </div>
                        <div className="col-md-6 text-end">
                            <h5>Invoice Info</h5>
                            <p><strong>Invoice ID:</strong> {bill.ConsultationBill_id || bill.id}</p>
                            <p><strong>Date:</strong> {bill.bill_date ? new Date(bill.bill_date).toLocaleDateString() : "N/A"}</p>
                        </div>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th className="text-end">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    Consultation - Dr. {details.doctorName}<br />
                                    <small className="text-muted">{details.specialization}</small>
                                </td>
                                <td className="text-end">₹{bill.amount}</td>
                            </tr>
                            <tr>
                                <th className="text-end">Total</th>
                                <th className="text-end">₹{bill.amount}</th>
                            </tr>
                        </tbody>
                    </table>

                    <div className="text-center mt-4">
                        <button onClick={generatePDF} className="btn btn-success btn-lg">
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewInvoice;
