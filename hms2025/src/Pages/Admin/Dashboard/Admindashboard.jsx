// src/Pages/Admin/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FiUsers, FiActivity, FiCalendar, FiDollarSign, FiBell, FiMenu, FiX } from 'react-icons/fi';
import './AdminDashboard.css'; // Scoped CSS for Admin Dashboard

// Mock data - replace with API calls
const mockStats = {
  totalPatients: 1240,
  activeDoctors: 42,
  pendingAppointments: 18,
  revenue: '$24,500'
};

const mockAppointments = [
  { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', time: '10:30 AM', status: 'Confirmed' },
  { id: 2, patient: 'Jane Wilson', doctor: 'Dr. Brown', time: '11:15 AM', status: 'Pending' },
  { id: 3, patient: 'Robert Lee', doctor: 'Dr. Johnson', time: '02:00 PM', status: 'Confirmed' },
];

const mockRecentPatients = [
  { id: 101, name: 'Michael Chen', age: 34, department: 'Cardiology', lastVisit: '2023-10-15' },
  { id: 102, name: 'Sarah Johnson', age: 28, department: 'Dermatology', lastVisit: '2023-10-16' },
  { id: 103, name: 'David Miller', age: 52, department: 'Orthopedics', lastVisit: '2023-10-14' },
];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="stat-card bg-white rounded-xl shadow-md p-6 flex items-center">
    <div className={`p-3 rounded-lg ${color} text-white mr-4`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AppointmentItem = ({ appointment }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
    <div>
      <h4 className="font-medium">{appointment.patient}</h4>
      <p className="text-gray-500 text-sm">{appointment.doctor}</p>
    </div>
    <div className="text-right">
      <p className="font-medium">{appointment.time}</p>
      <span className={`px-2 py-1 rounded-full text-xs ${
        appointment.status === 'Confirmed' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800 status-pending'
      }`}>
        {appointment.status}
      </span>
    </div>
  </div>
);

const PatientItem = ({ patient }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="py-3 px-4">{patient.id}</td>
    <td className="py-3 px-4">
      <div className="font-medium">{patient.name}</div>
      <div className="text-gray-500 text-sm">{patient.age} years</div>
    </td>
    <td className="py-3 px-4">{patient.department}</td>
    <td className="py-3 px-4">{patient.lastVisit}</td>
  </tr>
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:relative z-10 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out sidebar-mobile`}>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">MediCare</h1>
          <p className="text-gray-500">Hospital Management</p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {['Dashboard', 'Patients', 'Doctors', 'Appointments', 'Billing', 'Reports', 'Settings'].map((item) => (
              <li key={item}>
                <a 
                  href="#" 
                  className={`sidebar-nav-link flex items-center p-3 rounded-lg ${
                    item === 'Dashboard' 
                      ? 'active' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
              <p className="header-clock text-gray-500">{currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <FiBell size={20} />
                <span className="notification-badge absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="ml-2 hidden md:inline text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <StatCard 
            title="Total Patients" 
            value={mockStats.totalPatients} 
            icon={FiUsers} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Active Doctors" 
            value={mockStats.activeDoctors} 
            icon={FiActivity} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Pending Appointments" 
            value={mockStats.pendingAppointments} 
            icon={FiCalendar} 
            color="bg-yellow-500" 
          />
          <StatCard 
            title="Monthly Revenue" 
            value={mockStats.revenue} 
            icon={FiDollarSign} 
            color="bg-purple-500" 
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointments Panel */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Today's Appointments</h3>
                <a href="#" className="text-blue-500 text-sm font-medium">View All</a>
              </div>
              
              <div className="space-y-4">
                {mockAppointments.map(appointment => (
                  <AppointmentItem key={appointment.id} appointment={appointment} />
                ))}
              </div>
            </div>

            {/* Recent Patients */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Recent Patients</h3>
                <a href="#" className="text-blue-500 text-sm font-medium">View All</a>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecentPatients.map(patient => (
                      <PatientItem key={patient.id} patient={patient} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;