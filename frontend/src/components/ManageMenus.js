import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const ManageMenus = ({ closePopup }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newMenuDate, setNewMenuDate] = useState(new Date().toISOString().split("T")[0]);

    useEffect(() => {
        console.log("Fetching menus...");
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("menus")
            .select("*")
            .order("available_date", { ascending: false });

        console.log("Fetched menus:", data); // Debugging line

        if (error) {
            setError("Error loading menus.");
        } else {
            setMenus(data);
        }
        setLoading(false);
    };

    const addMenu = async () => {
        if (!newMenuDate) {
            setError("Please select a valid date.");
            return;
        }

        const { error } = await supabase
            .from("menus")
            .insert([{ available_date: newMenuDate }]);

        if (error) {
            setError("Failed to add menu.");
        } else {
            setNewMenuDate(new Date().toISOString().split("T")[0]);
            setError("");
            fetchMenus(); // Fetch updated list
        }
    };

    const deleteMenu = async (menuId) => {
        if (!window.confirm("Are you sure you want to delete this menu?")) return;

        const { error } = await supabase
            .from("menus")
            .delete()
            .eq("menu_id", menuId);

        if (!error) fetchMenus(); // Fetch updated list
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Manage Menus</h2>
                {error && <p className="error-text">{error}</p>}

                <input
                    type="date"
                    value={newMenuDate}
                    onChange={(e) => setNewMenuDate(e.target.value)}
                />
                <button className="primary-btn" onClick={addMenu}>Add Menu</button>

                {loading ? (
                    <p>Loading menus...</p>
                ) : menus.length > 0 ? (
                    <ul>
                        {menus.map((menu) => (
                            <li key={menu.menu_id}>
                                {menu.available_date}
                                <button className="danger-btn" onClick={() => deleteMenu(menu.menu_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No menus available.</p>
                )}

                <button className="secondary-btn" onClick={() => {
                    window.location.reload();
                }}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ManageMenus;
