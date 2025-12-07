import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Pages/Admin/add.css"; // Using existing CSS for consistency if possible, or just inline key styles

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [homePath, setHomePath] = useState("/admindashboard");

    useEffect(() => {
        const token = localStorage.getItem("access");
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decoded = JSON.parse(jsonPayload);
                const role = decoded.role || decoded.user_role || (decoded.groups && decoded.groups[0]);

                if (role) {
                    const normalizedRole = role.toLowerCase().replace(/[\s_]/g, '');
                    switch (normalizedRole) {
                        case 'admin':
                            setHomePath("/admindashboard");
                            break;
                        case 'doctor':
                            setHomePath("/doctor-dashboard");
                            break;
                        case 'receptionist':
                            setHomePath("/patients");
                            break;
                        case 'labtechnician':
                            setHomePath("/lab-test-orders"); // As per Login logic
                            break;
                        case 'pharmacist':
                            setHomePath("/medicines");
                            break;
                        default:
                            setHomePath("/admindashboard");
                    }
                }
            } catch (e) {
                console.error("Error decoding token in Layout:", e);
            }
        }
    }, [location.pathname]);

    // Don't show Home button if we are already on the home path (optional, but user said "every page")
    // If I show it on the home page, it's just a refresh or no-op. 
    // I'll show it everywhere as requested.

    return (
        <div className="main-layout">
            <Outlet />

            {/* Floating Home Button */}
            <button
                className="btn btn-primary rounded-circle shadow"
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0d6efd', // Bootstrap primary
                    border: 'none'
                }}
                onClick={() => navigate(homePath)}
                title="Go to Home"
            >
                <i className="fas fa-home" style={{ fontSize: '24px', color: 'white' }}></i>
            </button>
        </div>
    );
};

export default MainLayout;
