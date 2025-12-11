// Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import "./login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Balloon animation removed as per request

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser({ username, password });
            console.log("Login response:", res.data);

            const access = res.data.access || res.data.tokens?.access;
            const refresh = res.data.refresh || res.data.tokens?.refresh;

            if (access) {
                localStorage.setItem("access", access);
                if (refresh) localStorage.setItem("refresh", refresh);

                // Decode token to get role
                let role = res.data.role; // Try getting role from response body first
                if (!role && access) {
                    try {
                        const base64Url = access.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        const decoded = JSON.parse(jsonPayload);
                        role = decoded.role || decoded.user_role || (decoded.groups && decoded.groups[0]);
                        console.log("Decoded role:", role);
                    } catch (e) {
                        console.error("Failed to decode token", e);
                    }
                }

                alert("Login successful");

                // Navigate based on role
                if (role) {
                    const normalizedRole = role.toLowerCase().replace(/[\s_]/g, '');
                    switch (normalizedRole) {
                        case 'admin':
                            navigate("/admindashboard");
                            break;
                        case 'doctor':
                            navigate("/doctor-dashboard");
                            break;
                        case 'receptionist':
                            navigate("/patients");
                            break;
                        case 'labtechnician':
                            navigate("/lab-test-orders");
                            break;
                        case 'pharmacist':
                            navigate("/pharmacist-dashboard");
                            break;
                        default:
                            navigate("/admindashboard"); // Fallback
                    }
                } else {
                    navigate("/admindashboard"); // Default if no role found
                }
            } else {
                console.error("Token structure mismatch:", res.data);
                alert("Login failed: Invalid response from server");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-page">


            {/* Login Card */}
            <div className="login-card shadow-lg">
                <h2 className="text-center mb-4">Hospital Management</h2>
                <p className="text-center mb-4 login-subtitle">Sign in to your account</p>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control form-input"
                            placeholder="Enter username"
                            value={username}
                            autoComplete="username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control form-input"
                            placeholder="Enter password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 login-btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;