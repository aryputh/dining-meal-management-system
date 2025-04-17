import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Access Denied</h1>
            <p>You do not have permission to access this page.</p>
            <button className="primary-btn" onClick={() => navigate("/")}>Back to Welcome Page</button>
        </div>
    );
};

export default AccessDenied;
