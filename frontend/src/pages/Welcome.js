import React, { useState } from "react";
import AuthPopup from "../components/AuthPopup";

const Welcome = ({ setUser }) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div>
            <h1>Welcome to the Dining Meal Management System</h1>
            <button className="primary-btn" onClick={() => setShowPopup(true)}>Login / Register</button>
            {showPopup && <AuthPopup setUser={setUser} closePopup={() => setShowPopup(false)} />}
        </div>
    );
};

export default Welcome;
