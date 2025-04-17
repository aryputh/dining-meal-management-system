import React, { useState } from "react";
import AuthPopup from "../components/AuthPopup";

const Welcome = ({ setUser }) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div>
            <h3>Welcome!</h3>
            <button class="btn btn-primary" onClick={() => setShowPopup(true)}>Continue</button>
            {showPopup && <AuthPopup setUser={setUser} closePopup={() => setShowPopup(false)} />}
        </div>
    );
};

export default Welcome;
