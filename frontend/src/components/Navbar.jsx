import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

const Navbar = () => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand">Dining Meal Management System</a>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link active" href="#" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }}>
                                Dashboard <span className="visually-hidden">(current)</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="#" onClick={handleSignOut}>
                                Sign Out <span className="visually-hidden">(current)</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
