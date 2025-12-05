// Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import "./login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Create floating balloons on mount
    useEffect(() => {
        const container = document.querySelector(".balloon-container");
        if (!container) return;

        const colors = ["#FF6B6B", "#4ECDC4", "#FFBE0B", "#FB5607", "#8338EC"];
        const count = 15;

        for (let i = 0; i < count; i++) {
            const balloon = document.createElement("div");
            balloon.classList.add("balloon");

            // Random properties
            const size = 40 + Math.random() * 30; // 40px to 70px
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const duration = 5 + Math.random() * 3; // 15s to 30s
            const delay = Math.random() * 10;

            balloon.style.width = `${size}px`;
            balloon.style.height = `${size * 1.2}px`;
            balloon.style.backgroundColor = color;
            balloon.style.left = `${left}vw`;
            balloon.style.animationDuration = `${duration}s`;
            balloon.style.animationDelay = `${delay}s`;

            container.appendChild(balloon);
        }
    }, []);

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

                alert("Login successful");
                navigate("/dashboard");
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
            {/* Floating Balloons Background */}
            <div className="balloon-container"></div>

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