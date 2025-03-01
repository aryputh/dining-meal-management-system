import React, { useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const AuthPopup = ({ setUser, closePopup }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("student");
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Email validation
        if (isSignUp && !email.endsWith("@ddms.com")) {
            setError("Only @ddms.com emails are allowed.");
            setLoading(false);
            return;
        }

        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email, 
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        role: role,
                    },
                },
            });            

            if (error) {
                setError(error.message);
            } else if (data.user) {
                const user_id = data.user.id;
                const { error: insertError } = await supabase.from("users").insert([
                    {
                        user_id,
                        first_name: firstName,
                        last_name: lastName,
                        balance: 0,
                        role: role,
                    },
                ]);
                
                if (insertError) {
                    setError(insertError.message);
                } else {
                    setUser(data.user);
                    closePopup();
                }
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message);
            } else {
                setUser(data.user);
                closePopup();
            }
        }

        setLoading(false);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleAuth}>
                    {isSignUp && (
                        <>
                            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="student">Student</option>
                                <option value="admin">Admin</option>
                            </select>
                        </>
                    )}
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button className="primary-btn" type="submit" disabled={loading}>{isSignUp ? "Sign Up" : "Login"}</button>
                </form>
                <button className="primary-btn" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
                </button>
                <button className="secondary-btn" onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export default AuthPopup;
