import React, { useState } from "react";
import AuthPopup from "../components/AuthPopup";

const Welcome = ({ setUser }) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div>
            <h2>Welcome to the Dining Meal Management System</h2>
            <button class="btn btn-primary" onClick={() => setShowPopup(true)}>Continue</button>
            {showPopup && <AuthPopup setUser={setUser} closePopup={() => setShowPopup(false)} />}
        </div>
    );
};

export default Welcome;
