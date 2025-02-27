import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import ManageMealPlans from "../components/ManageMealPlans";

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from("users")
                    .select("first_name, last_name, role")
                    .eq("user_id", user.id)
                    .single();
                
                if (!error) {
                    setUserDetails(data);
                }
            }
        };
        
        fetchUserDetails();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <div>
            <h1>Dashboard</h1>
            {userDetails && (
                <>
                    <h2>Welcome, {userDetails.first_name} {userDetails.last_name}!</h2>
                    {userDetails.role === "admin" && (
                        <button onClick={() => setShowPopup(true)}>Manage Meal Plans</button>
                    )}
                </>
            )}
            <button onClick={handleSignOut}>Sign Out</button>

            {showPopup && <ManageMealPlans closePopup={() => setShowPopup(false)} />}
        </div>
    );
};

export default Dashboard;
