import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createLabBill,
    createLabBillItem,
    updateLabBill,
    getTestCategories,
    getPatients
} from "../../../api/api";
import "../Add.css";

const AddBill = () => {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [testCategories, setTestCategories] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [billItems, setBillItems] = useState([
        { test: "", price: "", subtotal: "" }
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch patients
                const patientsRes = await getPatients({ page_size: 1000 });
                const patientData = patientsRes.data.results ?? patientsRes.data;
                setPatients(patientData);

                // Fetch test categories
                const testsRes = await getTestCategories({ page_size: 1000 });
                const testData = testsRes.data.results ?? testsRes.data;
                setTestCategories(testData);
            } catch (err) {
                console.error("Error loading data:", err);
                if (err.response) {
                    alert("Failed to load data: " + JSON.stringify(err.response.data));
                } else {
                    alert("Failed to load required data: " + err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...billItems];
        newItems[index][field] = value;

        // Auto-calculate subtotal when price changes
        if (field === "price") {
            newItems[index].subtotal = value;
        }

        setBillItems(newItems);
    };

    const addItem = () => {
        setBillItems([...billItems, { test: "", price: "", subtotal: "" }]);
    };

    const removeItem = (index) => {
        if (billItems.length === 1) {
            alert("At least one item is required");
            return;
        }
        setBillItems(billItems.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return billItems.reduce((sum, item) => {
            return sum + (parseFloat(item.subtotal) || 0);
        }, 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPatient) {
            alert("Please select a patient");
            return;
        }

        // Validate all items
        for (let item of billItems) {
            if (!item.test || !item.price) {
                alert("Please fill all item details");
                return;
            }
        }

        try {
            const totalAmount = calculateTotal();

            // 1. Create Bill
            // We send items: [] to satisfy requirement, but add real items separately
            const billPayload = {
                patient: selectedPatient,
                total_amount: totalAmount,
                items: []
            };

            console.log("Step 1: Creating Bill", billPayload);
            const billRes = await createLabBill(billPayload);
            console.log("Bill created:", billRes.data);

            const newBillId = billRes.data.LabBill_id;

            // 2. Create Bill Items
            console.log("Step 2: Creating Items for Bill ID:", newBillId);
            await Promise.all(
                billItems.map(item => {
                    const itemPayload = {
                        bill: newBillId,
                        test: item.test, // Ensure this sends the ID (integer)
                        price: parseFloat(item.price),
                        subtotal: parseFloat(item.subtotal)
                    };
                    console.log("Item Payload:", itemPayload);
                    return createLabBillItem(itemPayload);
                })
            );

            // 3. Update Bill with Total (Fix for 0 price issue)
            console.log("Step 3: Updating Bill Total:", totalAmount);
            await updateLabBill(newBillId, { total_amount: parseFloat(totalAmount) });

            alert("Bill created successfully!");

            // Small delay to ensure DB commit
            await new Promise(resolve => setTimeout(resolve, 500));
            navigate("/lab-bills");

        } catch (err) {
            console.error("Error creating bill:", err);
            if (err.response && err.response.data) {
                console.error("Server Error Details:", err.response.data);
                // Simplify error message for user
                const errorData = err.response.data;
                const msg = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData;
                alert("Failed to create bill: " + msg);
            } else {
                alert("Failed to create bill: " + err.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">
                <h2 className="text-center mb-4">Create Lab Bill</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Select Patient</label>
                        <select
                            className="form-control"
                            value={selectedPatient}
                            onChange={(e) => setSelectedPatient(e.target.value)}
                            required
                        >
                            <option value="">-- Select Patient --</option>
                            {patients.map(patient => {
                                // Robust name checking
                                const patientName = patient.patient_name || patient.full_name || patient.name || patient.first_name || `Patient ${patient.Patient_id}`;
                                const patientId = patient.Patient_id || patient.id;

                                return (
                                    <option key={patientId} value={patientId}>
                                        {patientName} (ID: {patientId})
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <h5 className="mb-3">Bill Items</h5>
                    {billItems.map((item, index) => (
                        <div key={index} className="card mb-3 p-3 bg-light">
                            <div className="row">
                                <div className="col-md-5">
                                    <label className="form-label">Test Category</label>
                                    <select
                                        className="form-control"
                                        value={item.test}
                                        onChange={(e) => handleItemChange(index, "test", e.target.value)}
                                        required
                                    >
                                        <option value="">-- Select Test --</option>
                                        {testCategories.map(test => (
                                            <option key={test.LabTestCategory_id} value={test.LabTestCategory_id}>
                                                {test.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Price (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Subtotal (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        value={item.subtotal}
                                        readOnly
                                        disabled
                                    />
                                </div>
                                <div className="col-md-1 d-flex align-items-end">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeItem(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-secondary mb-3"
                        onClick={addItem}
                    >
                        + Add Another Test
                    </button>

                    <div className="alert alert-info">
                        <strong>Total Amount: ₹{calculateTotal()}</strong>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Create Bill
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBill;
