import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import Dashboard from "./Pages/Dashboard/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth routes */}
        <Route path="/" element={<Login />} />

        {/* admin dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
