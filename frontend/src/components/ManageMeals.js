import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const ManageMeals = ({ menuId, closePopup }) => {
    const [meals, setMeals] = useState([]);
    const [mealName, setMealName] = useState("");
    const [mealDescription, setMealDescription] = useState("");
    const [mealPrice, setMealPrice] = useState("");
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const [allergyOptions, setAllergyOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchMeals();
        fetchAllergies();
    }, []);

    const fetchMeals = async () => {
        setLoading(true);
        const { data: mealsData, error: mealsError } = await supabase
            .from("meals")
            .select("*, meal_allergies:meal_allergies(allergy_id, allergies(allergy_name))")
            .eq("menu_id", menuId);

        if (mealsError) {
            setError("Error loading meals.");
        } else {
            const mealsWithAllergies = mealsData.map(meal => ({
                ...meal,
                allergies: meal.meal_allergies.map(ma => ma.allergies)
            }));
            setMeals(mealsWithAllergies);
        }
        setLoading(false);
    };

    const fetchAllergies = async () => {
        const { data, error } = await supabase.from("allergies").select("*").order("allergy_name");
        if (!error) setAllergyOptions(data);
    };

    const handleAllergyChange = (e) => {
        const value = e.target.value;
        setSelectedAllergies((prev) =>
            prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
        );
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

        const { data: insertedMeals, error: mealError } = await supabase.from("meals").insert([
            { menu_id: menuId, meal_name: mealName, meal_description: mealDescription, price }
        ]).select();

        if (mealError || !insertedMeals || insertedMeals.length === 0) {
            setError("Failed to add meal.");
            return;
        }

        const newMealId = insertedMeals[0].meal_id;

        if (selectedAllergies.length > 0) {
            const allergyLinks = selectedAllergies.map(id => ({ meal_id: newMealId, allergy_id: id }));
            await supabase.from("meal_allergies").insert(allergyLinks);
        }

        setMealName("");
        setMealDescription("");
        setMealPrice("");
        setSelectedAllergies([]);
        setError("");
        fetchMeals();
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

                <div className="checkbox-group">
                    <label>Allergies:</label>
                    {allergyOptions.map((allergy) => (
                        <div key={allergy.allergy_id}>
                            <input
                                type="checkbox"
                                id={`allergy-${allergy.allergy_id}`}
                                value={allergy.allergy_id}
                                checked={selectedAllergies.includes(allergy.allergy_id)}
                                onChange={handleAllergyChange}
                            />
                            <label htmlFor={`allergy-${allergy.allergy_id}`}>{allergy.allergy_name}</label>
                        </div>
                    ))}
                </div>

                <button className="primary-btn" onClick={addMeal}>Add Meal</button>

                {loading ? (
                    <p>Loading meals...</p>
                ) : meals.length > 0 ? (
                    <ul>
                        {meals.map((meal) => (
                            <li key={meal.meal_id}>
                                <strong>{meal.meal_name}</strong>: {meal.meal_description} - ${meal.price.toFixed(2)}
                                <br />
                                {meal.allergies && meal.allergies.length > 0 && (
                                    <em>Allergies: {meal.allergies.map(a => a.allergy_name).join(", ")}</em>
                                )}
                                <br />
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
