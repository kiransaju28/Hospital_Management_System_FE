// src/Pages/Admin/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admindashboard.css';

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [openSubmenus, setOpenSubmenus] = useState({
    patient: false,
    staff: false,
    financials: false,
    inventory: false,
    consult: false,
    lab: false,
    help: false,
  });

  const navigate = useNavigate();

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    // Clear auth tokens from localStorage and redirect to login
    try {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    } catch (err) {
      // ignore storage errors
      console.error('Error clearing storage during logout', err);
    }
    // Use react-router navigation to return to the login page (root path)
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>HMS Admin</h2>
        </div>
        <ul className="sidebar-menu">
          <li>
            <button
              className={`menu-item ${activeItem === 'home' ? 'active' : ''}`}
              onClick={() => setActiveItem('home')}
            >
              <i className="fas fa-home"></i> Dashboard Home
            </button>
          </li>

          {/* Patient Management */}
          <li>
            <button
              className="menu-item submenu-toggle"
              onClick={() => toggleSubmenu('patient')}
            >
              <i className="fas fa-user-injured"></i> Patient Management
              <span className="arrow">{openSubmenus.patient ? '▲' : '▼'}</span>
            </button>
            {openSubmenus.patient && (
              <ul className="submenu">
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'admissions' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('admissions');
                      navigate('/add-patient');
                    }}
                  >
                    Admissions
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'records' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('records');
                      navigate('/patients');
                    }}
                  >
                    Patient Records
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'appointments' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('appointments');
                      navigate('/appointments');
                    }}
                  >
                    Appointment Bookings
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Staff Management */}
          <li>
            <button
              className="menu-item submenu-toggle"
              onClick={() => toggleSubmenu('staff')}
            >
              <i className="fas fa-user-md"></i> Staff Management
              <span className="arrow">{openSubmenus.staff ? '▲' : '▼'}</span>
            </button>
            {openSubmenus.staff && (
              <ul className="submenu">
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'doctors' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('doctors');
                      navigate('/doctors');
                    }}
                  >
                    Doctors/Nurses
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'admin-staff' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('admin-staff');
                      navigate('/staff');
                    }}
                  >
                    Administrative Staff
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'attendance' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('attendance');
                      // No dedicated attendance route yet; navigate to staff list as fallback
                      navigate('/staff');
                    }}
                  >
                    Attendance/Time-off Requests
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Financials & Billing */}
          <li>
            <button
              className="menu-item submenu-toggle"
              onClick={() => toggleSubmenu('financials')}
            >
              <i className="fas fa-file-invoice-dollar"></i> Financials & Billing
              <span className="arrow">{openSubmenus.financials ? '▲' : '▼'}</span>
            </button>
            {openSubmenus.financials && (
              <ul className="submenu">
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'invoices' ? 'active' : ''}`}
                    onClick={() => setActiveItem('invoices')}
                  >
                    Invoice Management
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'payroll' ? 'active' : ''}`}
                    onClick={() => setActiveItem('payroll')}
                  >
                    Payroll
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Inventory & Pharmacy */}
          <li>
            <button
              className="menu-item submenu-toggle"
              onClick={() => toggleSubmenu('inventory')}
            >
              <i className="fas fa-pills"></i> Inventory & Pharmacy
              <span className="arrow">{openSubmenus.inventory ? '▲' : '▼'}</span>
            </button>
            {openSubmenus.inventory && (
              <ul className="submenu">
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'medicines' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('medicines');
                      navigate('/medicines');
                    }}
                  >
                    Medicines
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Consult */}
          <li>
            <button
              className="menu-item submenu-toggle"
              onClick={() => toggleSubmenu('consult')}
            >
              <i className="fas fa-stethoscope"></i> Consult
              <span className="arrow">{openSubmenus.consult ? '▲' : '▼'}</span>
            </button>
            {openSubmenus.consult && (
              <ul className="submenu">
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'consult-patient' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('consult-patient');
                      navigate('/doctor-dashboard');
                    }}
                  >
                    Consult Patient
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'view-history' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('view-history');
                      navigate('/doctor/consultation-history');
                    }}
                  >
                    View Patient History
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Lab */}
          <li>
            <button
              className="menu-item submenu-toggle"
              onClick={() => toggleSubmenu('lab')}
            >
              <i className="fas fa-flask"></i> Lab
              <span className="arrow">{openSubmenus.lab ? '▲' : '▼'}</span>
            </button>
            {openSubmenus.lab && (
              <ul className="submenu">
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'lab-tests' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('lab-tests');
                      navigate('/lab-tests');
                    }}
                  >
                    Lab Test
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'todo' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('todo');
                      navigate('/lab-test-orders');
                    }}
                  >
                    ToDo
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'lab-reports' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('lab-reports');
                      navigate('/lab-reports');
                    }}
                  >
                    Reports
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'billings' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('billings');
                      navigate('/lab-bills');
                    }}
                  >
                    Billings
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Help & Support */}
          <li>
            <button
              className="menu-item submenu-toggle"
              onClick={() => toggleSubmenu('help')}
            >
              <i className="fas fa-question-circle"></i> Help & Support
              <span className="arrow">{openSubmenus.help ? '▲' : '▼'}</span>
            </button>
            {openSubmenus.help && (
              <ul className="submenu">
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'docs' ? 'active' : ''}`}
                    onClick={() => setActiveItem('docs')}
                  >
                    System Documentation
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Active Patients</h3>
            <p className="stat-value">—</p>
          </div>
          <div className="stat-card">
            <h3>Doctors On Duty</h3>
            <p className="stat-value">—</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Appointments Today</h3>
            <p className="stat-value">—</p>
          </div>
          <div className="stat-card">
            <h3>Recent Admissions</h3>
            <p className="stat-value">—</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;