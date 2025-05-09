import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const ManageMealPlans = ({ closePopup }) => {
    const [mealPlans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPlanName, setNewPlanName] = useState("");
    const [startingBalance, setStartingBalance] = useState("");
    const [error, setError] = useState("");
    const [editPlan, setEditPlan] = useState(null);
    const [editPlanName, setEditPlanName] = useState("");
    const [editStartingBalance, setEditStartingBalance] = useState("");

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const fetchMealPlans = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("meal_plans").select("*");

        if (error) {
            setError("Error loading meal plans.");
        } else {
            setMealPlans(data);
        }
        setLoading(false);
    };

    const validateAndRoundBalance = (value) => {
        let num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            return { valid: false, message: "Starting balance cannot be negative." };
        }
        num = Math.round(num * 100) / 100; // Ensures rounding to 2 decimal places
        return { valid: true, roundedValue: num.toFixed(2) };
    };

    const addMealPlan = async () => {
        const balanceCheck = validateAndRoundBalance(startingBalance);
        if (!newPlanName.trim() || !balanceCheck.valid) {
            setError(balanceCheck.message || "Plan name and starting balance are required.");
            return;
        }

        const { error } = await supabase.from("meal_plans").insert([
            { plan_name: newPlanName, starting_balance: balanceCheck.roundedValue }
        ]);

        if (error) {
            setError("Failed to add meal plan.");
        } else {
            setNewPlanName("");
            setStartingBalance("");
            setError("");
            fetchMealPlans();
        }
    };

    const deleteMealPlan = async (id) => {
        if (window.confirm("Are you sure you want to delete this meal plan?")) {
            await supabase.from("meal_plans").delete().eq("meal_plan_id", id);
            fetchMealPlans();
        }
    };

    const updateMealPlan = async (id) => {
        const balanceCheck = validateAndRoundBalance(editStartingBalance);
        if (!editPlanName.trim() || !balanceCheck.valid) {
            setError(balanceCheck.message || "Plan name and starting balance are required.");
            return;
        }

        const { error } = await supabase.from("meal_plans").update({
            plan_name: editPlanName,
            starting_balance: balanceCheck.roundedValue,
        }).eq("meal_plan_id", id);

        if (error) {
            setError("Failed to update meal plan.");
        } else {
            setEditPlan(null);
            setError("");
            fetchMealPlans();
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h4>Manage Meal Plans</h4>
                {error && <p className="text-danger">{error}</p>}

                <input
                    type="text"
                    class="form-control"
                    placeholder="Meal Plan Name"
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                />
                <input
                    type="number"
                    class="form-control"
                    placeholder="Starting Balance"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addMealPlan}>Add Meal Plan</button>

                {loading ? (
                    <p>Loading meal plans...</p>
                ) : mealPlans.length > 0 ? (
                    <ul>
                        {mealPlans.map((plan) => (
                            <li key={plan.meal_plan_id}>
                                {editPlan === plan.meal_plan_id ? (
                                    <>
                                        <input
                                            type="text"
                                            class="form-control"
                                            value={editPlanName}
                                            onChange={(e) => setEditPlanName(e.target.value)}
                                        />
                                        <input
                                            type="number"
                                            class="form-control"
                                            value={editStartingBalance}
                                            onChange={(e) => setEditStartingBalance(e.target.value)}
                                        />
                                        <button className="btn btn-primary btn-sm me-1" onClick={() => updateMealPlan(plan.meal_plan_id)}>Save</button>
                                        <button className="btn btn-secondary btn-sm me-1" onClick={() => { setEditPlan(null); setError(""); }}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        {plan.plan_name} - ${plan.starting_balance}
                                        <br />
                                        <button className="btn btn-primary btn-sm me-1" onClick={() => {
                                            setEditPlan(plan.meal_plan_id);
                                            setEditPlanName(plan.plan_name);
                                            setEditStartingBalance(plan.starting_balance);
                                        }}>Edit</button>
                                        <button className="btn btn-danger btn-sm me-1" onClick={() => deleteMealPlan(plan.meal_plan_id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No meal plans available.</p>
                )}

                <button className="btn btn-secondary" onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export default ManageMealPlans;
