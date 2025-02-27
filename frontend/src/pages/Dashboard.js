import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";
import ManageMealPlans from "../components/ManageMealPlans";

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [mealPlan, setMealPlan] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showManagePopup, setShowManagePopup] = useState(false);
    const [availableMealPlans, setAvailableMealPlans] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from("users")
                    .select("user_id, first_name, last_name, role, selected_meal_plan, balance")
                    .eq("user_id", user.id)
                    .single();
                
                if (!error) {
                    setUserDetails(data);

                    if (data.role === "student" && data.selected_meal_plan && data.balance >= 0) {
                        const { data: mealPlanData } = await supabase
                            .from("meal_plans")
                            .select("meal_plan_id, plan_name, starting_balance")
                            .eq("meal_plan_id", data.selected_meal_plan)
                            .single();

                        setMealPlan({ ...mealPlanData, balance: data.balance });
                    }
                }
            }
        };
        
        fetchUserDetails();
    }, []);

    const fetchMealPlans = async () => {
        const { data, error } = await supabase.from("meal_plans").select("meal_plan_id, plan_name, starting_balance");
        if (!error) setAvailableMealPlans(data);
    };

    const handleSelectMealPlan = async (mealPlanId, startingBalance) => {
        if (!userDetails || !userDetails.user_id) return;
        
        const { error } = await supabase
            .from("users")
            .update({ selected_meal_plan: mealPlanId, balance: startingBalance })
            .eq("user_id", userDetails.user_id);
        
        if (!error) {
            setMealPlan({
                meal_plan_id: mealPlanId,
                plan_name: availableMealPlans.find(mp => mp.meal_plan_id === mealPlanId).plan_name,
                starting_balance: startingBalance,
                balance: startingBalance
            });
            setShowPopup(false);
        }
    };

    const handleRemoveMealPlan = async () => {
        if (!userDetails || !mealPlan) return;

        const confirmRemove = window.confirm(
            "Warning: Removing your meal plan will reset your balance to $0. This action cannot be undone."
        );
        if (!confirmRemove) return;

        const { error } = await supabase
            .from("users")
            .update({ selected_meal_plan: null, balance: 0 })
            .eq("user_id", userDetails.user_id);

        if (!error) {
            setMealPlan(null);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            {userDetails && (
                <>
                    <h2>Welcome, {userDetails.first_name} {userDetails.last_name}!</h2>
                    {userDetails.role === "student" && (
                        mealPlan ? (
                            <div className="meal-plan-card">
                                <h3>{mealPlan.plan_name}</h3>
                                <p><strong>Starting Balance:</strong> ${mealPlan.starting_balance}</p>
                                <p><strong>Current Balance:</strong> ${mealPlan.balance}</p>
                                <button onClick={handleRemoveMealPlan} className="remove-meal-plan-btn">
                                    Remove Meal Plan
                                </button>
                            </div>
                        ) : (
                            <>
                                <p>No meal plan selected, select one now!</p>
                                <button onClick={() => { setShowPopup(true); fetchMealPlans(); }}>Select Meal Plan</button>
                            </>
                        )
                    )}
                    {userDetails.role === "admin" && (
                        <button onClick={() => setShowManagePopup(true)}>Manage Meal Plans</button>
                    )}
                </>
            )}
            <button onClick={handleSignOut}>Sign Out</button>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Select a Meal Plan</h2>
                        {availableMealPlans.length > 0 ? (
                            <ul>
                                {availableMealPlans.map((plan) => (
                                    <li key={plan.meal_plan_id}>
                                        {plan.plan_name} - ${plan.starting_balance}
                                        <button onClick={() => handleSelectMealPlan(plan.meal_plan_id, plan.starting_balance)}>Select</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No meal plans available.</p>
                        )}
                        <button onClick={() => setShowPopup(false)}>Close</button>
                    </div>
                </div>
            )}
            {showManagePopup && <ManageMealPlans closePopup={() => setShowManagePopup(false)} />}
        </div>
    );
};

export default Dashboard;