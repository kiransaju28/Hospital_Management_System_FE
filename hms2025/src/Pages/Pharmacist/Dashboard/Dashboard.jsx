import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // We'll create this

const Dashboard = () => {
    return (
        <div className="pharmacist-dashboard">
            <div className="dashboard-header">
                <h1>Pharmacist Dashboard</h1>
                <p>Manage medicines, stock, and patient bills.</p>
            </div>

            <div className="dashboard-cards">
                {/* Card 1: Medicines Inventory */}
                <div className="card shadow-sm hover-effect">
                    <div className="card-body text-center">
                        <h3 className="card-title">Medicine Inventory</h3>
                        <p className="card-text">
                            View and manage the list of all available medicines.
                        </p>
                        <Link to="/medicines" className="btn btn-primary">
                            View Medicines
                        </Link>
                    </div>
                </div>

                {/* Card 2: Stock Management */}
                <div className="card shadow-sm hover-effect">
                    <div className="card-body text-center">
                        <h3 className="card-title">Stock Management</h3>
                        <p className="card-text">
                            Track stock levels, add new stock, and view purchas history.
                        </p>
                        <Link to="/pharmacist/stock" className="btn btn-success">
                            Manage Stock
                        </Link>
                    </div>
                </div>

                {/* Card 3: Billing */}
                <div className="card shadow-sm hover-effect">
                    <div className="card-body text-center">
                        <h3 className="card-title">Billing</h3>
                        <p className="card-text">
                            View pending prescriptions and generate bills for patients.
                        </p>
                        <Link to="/pharmacist/pending-bills" className="btn btn-warning">
                            Pending Bills
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
