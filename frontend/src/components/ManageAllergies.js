import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const ManageAllergies = ({ closePopup }) => {
    const [allergies, setAllergies] = useState([]);
    const [newAllergy, setNewAllergy] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllergies();
    }, []);

    const fetchAllergies = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("allergies").select("*").order("allergy_name");
        if (!error) setAllergies(data);
        setLoading(false);
    };

    const addAllergy = async () => {
        const normalized = newAllergy.trim().toLowerCase();
        if (!normalized) {
            setError("Allergy name cannot be empty.");
            return;
        }

        const duplicate = allergies.find(a => a.allergy_name.toLowerCase() === normalized);
        if (duplicate) {
            setError("Allergy already exists.");
            return;
        }

        const { error } = await supabase.from("allergies").insert([{ allergy_name: newAllergy.trim() }]);
        if (error) {
            setError("Failed to add allergy.");
        } else {
            setNewAllergy("");
            setError("");
            fetchAllergies();
        }
    };

    const deleteAllergy = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this allergy?");
        if (!confirm) return;

        const { error } = await supabase.from("allergies").delete().eq("allergy_id", id);
        if (!error) fetchAllergies();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Manage Allergy Types</h3>
                {error && <p className="text-danger">{error}</p>}

                <input
                    type="text"
                    class="form-control"
                    placeholder="New allergy name"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addAllergy}>Add Allergy</button>

                {loading ? (
                    <p>Loading allergies...</p>
                ) : allergies.length > 0 ? (
                    <ul>
                        {allergies.map((allergy) => (
                            <li key={allergy.allergy_id}>
                                {allergy.allergy_name}
                                <br />
                                <button className="btn btn-danger btn-sm me-1" onClick={() => deleteAllergy(allergy.allergy_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No allergies available.</p>
                )}

                <button className="btn btn-secondary" onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export default ManageAllergies;
