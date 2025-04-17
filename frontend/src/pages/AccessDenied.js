import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div>
            <p>You do not have permission to access this page.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>Back</button>
        </div>
    );
};

export default AccessDenied;
