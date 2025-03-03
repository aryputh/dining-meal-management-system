import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const ManagePaymentMethods = ({ closePopup }) => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [newMethodName, setNewMethodName] = useState("");
    const [editMethod, setEditMethod] = useState(null);
    const [editMethodName, setEditMethodName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        const { data, error } = await supabase.from("payment_methods").select("*");
        if (error) {
            setError("Error loading payment methods.");
        } else {
            setPaymentMethods(data);
            setError(""); // Clear error on success
        }
    };

    const addPaymentMethod = async () => {
        if (!newMethodName.trim()) {
            setError("Payment method name is required.");
            return;
        }

        const { error } = await supabase.from("payment_methods").insert([{ payment_name: newMethodName }]);
        if (error) {
            setError("Failed to add payment method.");
        } else {
            setNewMethodName("");
            setError(""); // Clear error on success
            fetchPaymentMethods();
        }
    };

    const updatePaymentMethod = async (id) => {
        if (!editMethodName.trim()) {
            setError("Payment method name cannot be empty.");
            return;
        }

        const { error } = await supabase
            .from("payment_methods")
            .update({ payment_name: editMethodName })
            .eq("payment_method_id", id);

        if (error) {
            setError("Failed to update payment method.");
        } else {
            setEditMethod(null);
            setError(""); // Clear error on success
            fetchPaymentMethods();
        }
    };

    const deletePaymentMethod = async (id) => {
        if (window.confirm("Are you sure you want to delete this payment method?")) {
            const { error } = await supabase.from("payment_methods").delete().eq("payment_method_id", id);
            if (!error) {
                setError(""); // Clear error on success
                fetchPaymentMethods();
            }
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Manage Payment Methods</h2>
                {error && <p className="error-text">{error}</p>}

                <input
                    type="text"
                    placeholder="New Payment Method"
                    value={newMethodName}
                    onChange={(e) => setNewMethodName(e.target.value)}
                />
                <button className="primary-btn" onClick={addPaymentMethod}>Add Payment Method</button>

                {paymentMethods.length > 0 ? (
                    <ul>
                        {paymentMethods.map((method) => (
                            <li key={method.payment_method_id}>
                                {editMethod === method.payment_method_id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editMethodName}
                                            onChange={(e) => setEditMethodName(e.target.value)}
                                        />
                                        <button className="primary-btn" onClick={() => updatePaymentMethod(method.payment_method_id)}>Save</button>
                                        <button className="secondary-btn" onClick={() => setEditMethod(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        {method.payment_name}
                                        <button className="primary-btn" onClick={() => {
                                            setEditMethod(method.payment_method_id);
                                            setEditMethodName(method.payment_name);
                                        }}>Edit</button>
                                        <button className="danger-btn" onClick={() => deletePaymentMethod(method.payment_method_id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No payment methods available.</p>
                )}

                <button className="secondary-btn" onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export default ManagePaymentMethods;
