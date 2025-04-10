import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";
import ManageMealPlans from "../components/ManageMealPlans";
import ManagePaymentMethods from "../components/ManagePaymentMethods";
import AddFundsPopup from "../components/AddFundsPopup";
import History from "../components/History";
import ManageMenus from "../components/ManageMenus";
import { FeedbackPopup, ViewFeedback } from "../components/FeedbackPopup";
import ManageAllergies from "../components/ManageAllergies";

const Dashboard = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [mealPlan, setMealPlan] = useState(null);
    const [showSelectMealPlanPopup, setShowSelectMealPlanPopup] = useState(false);
    const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
    const [showViewFeedbackPopup, setShowViewFeedbackPopup] = useState(false);
    const [showManagePopup, setShowManagePopup] = useState(false);
    const [showManagePaymentsPopup, setShowManagePaymentsPopup] = useState(false);
    const [availableMealPlans, setAvailableMealPlans] = useState([]);
    const [showAddFundsPopup, setShowAddFundsPopup] = useState(false);
    const [menus, setMenus] = useState([]);
    const [loadingMenus, setLoadingMenus] = useState(true);
    const [historyUpdated, setHistoryUpdated] = useState(false);
    const [showManageMenusPopup, setShowManageMenusPopup] = useState(false);
    const [showManageAllergiesPopup, setShowManageAllergiesPopup] = useState(false);

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
                            .select("*")
                            .eq("meal_plan_id", data.selected_meal_plan)
                            .single();

                        setMealPlan({ ...mealPlanData, balance: data.balance });
                    }
                }
            }
        };

        const fetchMenusAndMeals = async () => {
            const { data: menusData, error: menusError } = await supabase.from("menus").select("*");
            if (menusError) return;
        
            const menusWithMeals = await Promise.all(
                menusData.map(async (menu) => {
                    const { data: mealsData, error: mealsError } = await supabase
                        .from("meals")
                        .select("*, meal_allergies:meal_allergies(allergy_id, allergies(allergy_name))")
                        .eq("menu_id", menu.menu_id);
        
                    const mealsWithAllergies = mealsData.map(meal => ({
                        ...meal,
                        allergies: meal.meal_allergies.map(ma => ma.allergies)
                    }));
        
                    return { ...menu, meals: mealsWithAllergies };
                })
            );
        
            setMenus(menusWithMeals);
            setLoadingMenus(false);
        };        

        fetchUserDetails();
        fetchMenusAndMeals();
    }, [historyUpdated]);

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
            await supabase.from("history").insert([
                {
                    user_id: userDetails.user_id,
                    description: `Selected meal plan: ${availableMealPlans.find(mp => mp.meal_plan_id === mealPlanId).plan_name}`
                }
            ]);

            setMealPlan({
                meal_plan_id: mealPlanId,
                plan_name: availableMealPlans.find(mp => mp.meal_plan_id === mealPlanId).plan_name,
                starting_balance: startingBalance,
                balance: startingBalance
            });

            setShowSelectMealPlanPopup(false);
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
            await supabase.from("history").insert([
                {
                    user_id: userDetails.user_id,
                    description: `Removed meal plan: ${mealPlan.plan_name}`
                }
            ]);

            window.location.reload();
            setMealPlan(null);
        }
    };

    const handleOrderMeal = async (meal) => {
        if (!userDetails || userDetails.role !== "student") return;

        const confirmOrder = window.confirm(`Confirm purchase of ${meal.meal_name} for $${meal.price.toFixed(2)}?`);
        if (!confirmOrder) return;

        if (userDetails.balance < meal.price) {
            alert("Insufficient balance.");
            return;
        }

        const newBalance = userDetails.balance - meal.price;

        const { error } = await supabase
            .from("users")
            .update({ balance: newBalance })
            .eq("user_id", userDetails.user_id);

        if (!error) {
            await supabase.from("history").insert([
                {
                    user_id: userDetails.user_id,
                    description: `Ordered ${meal.meal_name} for $${meal.price.toFixed(2)}`
                }
            ]);

            setUserDetails((prev) => ({ ...prev, balance: newBalance }));
            setHistoryUpdated((prev) => !prev);
        }
    };

    const updateBalance = (newBalance) => {
        setMealPlan((prev) => ({ ...prev, balance: newBalance }));
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            {userDetails && (
                <div className="dashboard-content">
                    {/* Left Section - Meal Plan Info */}
                    <div className="left-section">
                        <h2>Welcome, {userDetails.first_name} {userDetails.last_name}!</h2>
                        {userDetails.role === "student" && (
                            mealPlan ? (
                                <div className="meal-plan-card">
                                    <h3>{mealPlan.plan_name}</h3>
                                    <p><strong>Starting Balance:</strong> ${mealPlan.starting_balance}</p>
                                    <p><strong>Current Balance:</strong> ${userDetails.balance.toFixed(2)}</p>
                                    <div className="meal-plan-actions">
                                        <button className="primary-btn" onClick={() => setShowAddFundsPopup(true)}>Add Funds</button>
                                        <button className="danger-btn" onClick={handleRemoveMealPlan}>Remove Meal Plan</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="meal-plan-selection">
                                    <p>No meal plan selected, select one now!</p>
                                    <button className="primary-btn" onClick={() => { setShowSelectMealPlanPopup(true); fetchMealPlans(); }}>
                                        Select Meal Plan
                                    </button>
                                </div>
                            )
                        )}
                        {userDetails.role === "admin" && (
                            <div className="admin-buttons">
                                <button className="primary-btn" onClick={() => setShowManageMenusPopup(true)}>Manage Menus</button>
                                <button className="primary-btn" onClick={() => setShowManagePopup(true)}>Manage Meal Plans</button>
                                <button className="primary-btn" onClick={() => setShowManagePaymentsPopup(true)}>Manage Payment Methods</button>
                                <button className="primary-btn" onClick={() => setShowManageAllergiesPopup(true)}>Manage Allergies</button>
                            </div>
                        )}
                    </div>
                    {userDetails.role === "student" && (
                        <button className="primary-btn" onClick={() => setShowFeedbackPopup(true)}>Give Feedback</button>
                    )}
                    {userDetails.role === "admin" && (
                        <button className="primary-btn" onClick={() => setShowViewFeedbackPopup(true)}>View Feedback</button>
                    )}
                </div>
            )}

            <div className="menu-section">
                <h2>Menus</h2>
                {loadingMenus ? (
                    <p>Loading menus...</p>
                ) : menus.length === 0 ? (
                    <p>No menus to display.</p>
                ) : (
                    menus.map((menu) => (
                        <div key={menu.menu_id} className="menu-card">
                            <h3>Menu for {menu.available_date}</h3>
                            {menu.meals.length > 0 ? (
                                <ul>
                                    {menu.meals.map((meal) => (
                                        <li key={meal.meal_id} className="meal-item">
                                            <strong>{meal.meal_name}</strong>: {meal.meal_description} - ${meal.price.toFixed(2)}
                                            {meal.allergies && meal.allergies.length > 0 && (
                                                <div><em>Allergies: {meal.allergies.map(a => a.allergy_name).join(", ")}</em></div>
                                            )}
                                            {userDetails?.role === "student" && (
                                                <button className="primary-btn" onClick={() =>
                                                    handleOrderMeal(meal)
                                                }>Order</button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No meals available for this menu.</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            <button className="secondary-btn" onClick={handleSignOut}>Sign Out</button>

            {showSelectMealPlanPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Select a Meal Plan</h2>
                        {availableMealPlans.length > 0 ? (
                            <ul>
                                {availableMealPlans.map((plan) => (
                                    <li key={plan.meal_plan_id}>
                                        {plan.plan_name} - ${plan.starting_balance}
                                        <button className="primary-btn" onClick={() => handleSelectMealPlan(plan.meal_plan_id, plan.starting_balance)}>Select</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No meal plans available.</p>
                        )}
                        <button className="secondary-btn" onClick={() => setShowSelectMealPlanPopup(false)}>Close</button>
                    </div>
                </div>
            )}
            {userDetails?.role === "student" && <History userId={userDetails.user_id} key={historyUpdated} />}
            {showManageMenusPopup && <ManageMenus closePopup={() => setShowManageMenusPopup(false)} />}
            {showManagePopup && <ManageMealPlans closePopup={() => setShowManagePopup(false)} />}
            {showManagePaymentsPopup && <ManagePaymentMethods closePopup={() => setShowManagePaymentsPopup(false)} />}
            {showAddFundsPopup && (
                <AddFundsPopup
                    closePopup={() => setShowAddFundsPopup(false)}
                    userId={userDetails.user_id}
                    currentBalance={mealPlan.balance}
                    updateBalance={updateBalance}
                />
            )}
            {showFeedbackPopup && <FeedbackPopup userId={userDetails.user_id} closePopup={() => setShowFeedbackPopup(false)} />}
            {showViewFeedbackPopup && <ViewFeedback closePopup={() => setShowViewFeedbackPopup(false)} />}
            {showManageAllergiesPopup && <ManageAllergies closePopup={() => setShowManageAllergiesPopup(false)} />}
        </div>
    );
};

export default Dashboard;
