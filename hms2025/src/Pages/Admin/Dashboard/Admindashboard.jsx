// src/Pages/Admin/Dashboard/Admindashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  // Dummy data for the chart
  const data = [
    { name: 'Jan', patients: 40 },
    { name: 'Feb', patients: 30 },
    { name: 'Mar', patients: 20 },
    { name: 'Apr', patients: 27 },
    { name: 'May', patients: 18 },
    { name: 'Jun', patients: 23 },
    { name: 'Jul', patients: 34 },
    { name: 'Aug', patients: 45 },
    { name: 'Sep', patients: 60 },
    { name: 'Oct', patients: 55 },
    { name: 'Nov', patients: 70 },
    { name: 'Dec', patients: 85 },
  ];

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    } catch (err) {
      console.error('Error clearing storage during logout', err);
    }
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
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
                      navigate('/staff');
                    }}
                  >
                    Staff List
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
                    onClick={() => {
                      setActiveItem('invoices');
                      navigate('/admin/invoices');
                    }}
                  >
                    Invoice Management
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
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'stock' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('stock');
                      navigate('/pharmacist/stock');
                    }}
                  >
                    Stock Management
                  </button>
                </li>
                <li>
                  <button
                    className={`submenu-item ${activeItem === 'billing' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveItem('billing');
                      navigate('/pharmacist/pending-bills');
                    }}
                  >
                    Pharmacy Billing
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
          <div className="card kpi-card purple">
            <div className="kpi-title">Total Patients</div>
            <div className="kpi-value">1,245</div>
          </div>
          <div className="card kpi-card green">
            <div className="kpi-title">Doctors On Duty</div>
            <div className="kpi-value">28</div>
          </div>
          <div className="card kpi-card blue">
            <div className="kpi-title">Appointments Today</div>
            <div className="kpi-value">150</div>
          </div>
          <div className="card kpi-card orange">
            <div className="kpi-title">Pending Orders</div>
            <div className="kpi-value">12</div>
          </div>
        </div>

        {/* Analytics Chart Section */}
        <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
          <div className="kpi-title" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Patient Increase Overview</div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="patients" fill="#5646ff" barSize={30} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;