import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const ManageMeals = ({ menuId, closePopup }) => {
    const [meals, setMeals] = useState([]);
    const [mealName, setMealName] = useState("");
    const [mealDescription, setMealDescription] = useState("");
    const [mealPrice, setMealPrice] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("meals")
            .select("*")
            .eq("menu_id", menuId);

        if (error) {
            setError("Error loading meals.");
        } else {
            setMeals(data);
        }
        setLoading(false);
    };

    const addMeal = async () => {
        if (!mealName.trim() || !mealDescription.trim() || !mealPrice) {
            setError("All fields are required.");
            return;
        }

        const price = parseFloat(mealPrice);
        if (isNaN(price) || price <= 0) {
            setError("Price must be a valid positive number.");
            return;
        }

        const { error } = await supabase.from("meals").insert([
            { menu_id: menuId, meal_name: mealName, meal_description: mealDescription, price }
        ]);

        if (error) {
            setError("Failed to add meal.");
        } else {
            setMealName("");
            setMealDescription("");
            setMealPrice("");
            setError("");
            fetchMeals();
        }
    };

    const deleteMeal = async (mealId) => {
        if (!window.confirm("Are you sure you want to delete this meal?")) return;

        const { error } = await supabase.from("meals").delete().eq("meal_id", mealId);
        if (!error) fetchMeals();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Manage Meals</h2>
                {error && <p className="error-text">{error}</p>}

                <input
                    type="text"
                    placeholder="Meal Name"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Meal Description"
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={mealPrice}
                    onChange={(e) => setMealPrice(e.target.value)}
                />
                <button className="primary-btn" onClick={addMeal}>Add Meal</button>

                {loading ? (
                    <p>Loading meals...</p>
                ) : meals.length > 0 ? (
                    <ul>
                        {meals.map((meal) => (
                            <li key={meal.meal_id}>
                                <strong>{meal.meal_name}</strong>: {meal.meal_description} - ${meal.price.toFixed(2)}
                                <button className="danger-btn" onClick={() => deleteMeal(meal.meal_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No meals available.</p>
                )}

                <button className="secondary-btn" onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export default ManageMeals;
