import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            if (userDetails?.role === "student") {
                const { data, error } = await supabase.from("payment_methods").select("*");
                if (!error) setPaymentMethods(data);
            }
        };

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
                    const { data: mealsData } = await supabase
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

        if (showPaymentPopup) fetchPayments();
        fetchUserDetails();
        fetchMenusAndMeals();
    }, [historyUpdated, showPaymentPopup]);

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
                    description: `Selected Plan: ${availableMealPlans.find(mp => mp.meal_plan_id === mealPlanId).plan_name}`
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
            "Removing your meal plan will reset your balance to $0. This cannot be undone."
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
                    description: `Removed Plan: ${mealPlan.plan_name}`
                }
            ]);

            window.location.reload();
            setMealPlan(null);
        }
    };

    const confirmOrder = async () => {
        if (!selectedMeal || !selectedPaymentMethod) return;

        if (userDetails.balance < selectedMeal.price) {
            alert("Insufficient balance.");
            return;
        }

        const newBalance = userDetails.balance - selectedMeal.price;

        const { error: updateError } = await supabase
            .from("users")
            .update({ balance: newBalance })
            .eq("user_id", userDetails.user_id);

        if (!updateError) {
            await supabase.from("history").insert([
                {
                    user_id: userDetails.user_id,
                    description: `Ordered ${selectedMeal.meal_name} ($${selectedMeal.price.toFixed(2)})`
                }
            ]);

            await supabase.from("orders").insert([
                {
                    user_id: userDetails.user_id,
                    payment_method_id: selectedPaymentMethod,
                    total: selectedMeal.price
                }
            ]);

            setUserDetails((prev) => ({ ...prev, balance: newBalance }));
            setHistoryUpdated((prev) => !prev);
            setSelectedMeal(null);
            setSelectedPaymentMethod(null);
            setShowPaymentPopup(false);
        }
    };

    const updateBalance = (newBalance) => {
        setMealPlan((prev) => ({ ...prev, balance: newBalance }));
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <h2>Dashboard</h2>
                {userDetails && (
                    <div className="dashboard-content">
                        {/* Left Section - Meal Plan Info */}
                        <div className="left-section">
                            <h3>Welcome, {userDetails.first_name} {userDetails.last_name}!</h3>
                            {userDetails.role === "student" && (
                                mealPlan ? (
                                    <div className="card bg-secondary mb-3">
                                        <div className="card-header">{mealPlan.plan_name}</div>
                                        <div className="card-body">
                                            <p className="card-text"><strong>Balance</strong><br />${userDetails.balance.toFixed(2)} / ${mealPlan.starting_balance.toFixed(2)}</p>
                                            <button className="btn btn-primary me-1" onClick={() => setShowAddFundsPopup(true)}>Add Funds</button>
                                            <button className="btn btn-danger me-1" onClick={handleRemoveMealPlan}>Remove Plan</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card bg-secondary mb-3">
                                        <div className="card-header">No Meal Plan Selected</div>
                                        <div className="card-body">
                                            <button className="btn btn-primary" onClick={() => { setShowSelectMealPlanPopup(true); fetchMealPlans(); }}>
                                                Select Meal Plan
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                            {userDetails.role === "admin" && (
                                <div className="card bg-secondary mb-3">
                                    <div className="card-header">Admin Controls</div>
                                    <div className="card-body">
                                        <p className="card-text">Manage meals, allergies, menus, and payment methods.</p>
                                        <button className="btn btn-primary me-1 mb-1" onClick={() => setShowManageMenusPopup(true)}>Manage Menus</button>
                                        <button className="btn btn-primary me-1 mb-1" onClick={() => setShowManagePopup(true)}>Manage Meal Plans</button>
                                        <button className="btn btn-primary me-1 mb-1" onClick={() => setShowManagePaymentsPopup(true)}>Manage Payment Methods</button>
                                        <button className="btn btn-primary me-1 mb-1" onClick={() => setShowManageAllergiesPopup(true)}>Manage Allergies</button>
                                        <br /><br />
                                        <p className="card-text">View feedback and analytics from students.</p>
                                        <button className="btn btn-primary me-1 mb-1" onClick={() => setShowViewFeedbackPopup(true)}>View Feedback</button>
                                        <button className="btn btn-primary me-1 mb-1" onClick={() => window.location.href = "/analytics"}>Analytics</button>
                                    </div>
                                </div>
                            )}
                            {userDetails.role === "student" && (
                                <button className="btn btn-primary" onClick={() => setShowFeedbackPopup(true)}>Give Feedback</button>
                            )}
                        </div>
                    </div>
                )}
                <div className="menu-section">
                    {loadingMenus ? (
                        <p>Loading menus...</p>
                    ) : menus.length === 0 ? (
                        <p>No menus to display.</p>
                    ) : (
                        menus.map((menu) => (
                            <div key={menu.menu_id} className="card bg-secondary mb-3">
                                <div className="card-header">Menu for {menu.available_date}</div>
                                <div className="card-body">
                                    {menu.meals.length > 0 ? (
                                        <ul>
                                            {menu.meals.map((meal) => (
                                                <li key={meal.meal_id} className="card-text">
                                                    <strong>{meal.meal_name}</strong> (${meal.price.toFixed(2)})<br></br>{meal.meal_description}
                                                    {meal.allergies && meal.allergies.length > 0 && (
                                                        <div>
                                                            {meal.allergies.map((a, index) => (
                                                                <span key={index} className="badge rounded-pill bg-warning me-1">
                                                                    {a.allergy_name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {userDetails?.role === "student" && (
                                                        <div>
                                                            <br />
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => {
                                                                    setSelectedMeal(meal);
                                                                    setShowPaymentPopup(true);
                                                                }}
                                                            >
                                                                Order
                                                            </button>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No meals available for this menu.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {userDetails?.role === "student" && (
                    <div className="card bg-secondary mb-3" style={{ maxWidth: "20rem" }}>
                        <div className="card-header">History</div>
                        <div className="card-body">
                            <div className="card-text">
                                <History userId={userDetails.user_id} key={historyUpdated} />
                            </div>
                        </div>
                    </div>
                )}
                {showSelectMealPlanPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h3>Select a Meal Plan</h3>
                            {availableMealPlans.length > 0 ? (
                                <ul>
                                    {availableMealPlans.map((plan) => (
                                        <li key={plan.meal_plan_id}>
                                            {plan.plan_name} - ${plan.starting_balance}
                                            <button className="btn btn-primary" onClick={() => handleSelectMealPlan(plan.meal_plan_id, plan.starting_balance)}>Select</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No meal plans available.</p>
                            )}
                            <button className="btn btn-secondary" onClick={() => setShowSelectMealPlanPopup(false)}>Close</button>
                        </div>
                    </div>
                )}
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
                {showPaymentPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h3>Select Payment Method</h3>
                            {paymentMethods.length > 0 ? (
                                <ul>
                                    {paymentMethods.map(method => (
                                        <li key={method.payment_method_id}>
                                            <input
                                                type="radio"
                                                id={method.payment_method_id}
                                                name="payment"
                                                value={method.payment_method_id}
                                                onChange={() => setSelectedPaymentMethod(method.payment_method_id)}
                                            />
                                            <label htmlFor={method.payment_method_id}>{method.payment_name}</label>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No payment methods available.</p>
                            )}
                            <button
                                className="btn btn-primary"
                                disabled={!selectedPaymentMethod}
                                onClick={confirmOrder}
                            >
                                Confirm Order
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowPaymentPopup(false);
                                    setSelectedPaymentMethod(null);
                                    setSelectedMeal(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;
