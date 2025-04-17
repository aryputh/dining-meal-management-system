import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";
import ManageMeals from "./ManageMeals";

const ManageMenus = ({ closePopup }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [newMenuDate, setNewMenuDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedMenu, setSelectedMenu] = useState(null);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("menus")
            .select("*")
            .order("available_date", { ascending: false });

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
                <h4>Manage Menus</h4>
                {error && <p className="text-danger">{error}</p>}

                <input
                    type="date"
                    className="form-control"
                    value={newMenuDate}
                    onChange={(e) => setNewMenuDate(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addMenu}>Add Menu</button>

                {loading ? (
                    <p>Loading menus...</p>
                ) : menus.length > 0 ? (
                    <ul>
                        {menus.map((menu) => (
                            <li key={menu.menu_id}>
                                {menu.available_date}
                                <br />
                                <button className="btn btn-primary btn-sm me-1" onClick={() => setSelectedMenu(menu)}>Manage Meals</button>
                                <button className="btn btn-danger btn-sm me-1" onClick={() => deleteMenu(menu.menu_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No menus available.</p>
                )}

                <button className="btn btn-secondary" onClick={() => {
                    window.location.reload();
                }}>
                    Close
                </button>

                {selectedMenu && (
                    <ManageMeals
                        menuId={selectedMenu.menu_id}
                        menuDate={selectedMenu.available_date}
                        closePopup={() => setSelectedMenu(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default ManageMenus;
