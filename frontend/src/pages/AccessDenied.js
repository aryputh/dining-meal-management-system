import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Back to Welcome Page</button>
        </div>
    );
};

export default AccessDenied;
