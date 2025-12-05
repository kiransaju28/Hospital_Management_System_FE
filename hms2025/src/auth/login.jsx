import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import "./login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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
            <div className="login-card shadow-lg">
                <h2 className="text-center mb-4">Login</h2>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Enter username"
                            value={username}
                            autoComplete="username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
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
