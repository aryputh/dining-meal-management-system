import React, { useState } from "react";
import Navbar from "../components/Navbar";
import AuthPopup from "../components/AuthPopup";

const Welcome = ({ setUser }) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <Navbar />
            <div className="welcome-container">
                <div>
                    <h3>Welcome!</h3>
                    <p>Easy track and manage your meal plan, place orders, and add funds!</p>
                    <button class="btn btn-primary" onClick={() => setShowPopup(true)}>Continue</button>
                    {showPopup && <AuthPopup setUser={setUser} closePopup={() => setShowPopup(false)} />}
                </div>
            </div>
        </>
    );
};

export default Welcome;
