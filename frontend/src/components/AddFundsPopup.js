import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const AddFundsPopup = ({ closePopup, userId, currentBalance, updateBalance }) => {
    const [amount, setAmount] = useState("");
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        const { data, error } = await supabase.from("payment_methods").select("payment_method_id, payment_name");
        if (error) {
            setError("Error loading payment methods.");
        } else {
            setPaymentMethods(data);
        }
    };

    const validateAmount = (value) => {
        let num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            return "Amount must be greater than 0.";
        }
        num = Math.round(num * 100) / 100; // Round to 2 decimal places
        return { valid: true, roundedValue: num.toFixed(2) };
    };

    const handleAddFunds = async () => {
        const amountValidation = validateAmount(amount);
        if (typeof amountValidation === "string") {
            setError(amountValidation);
            return;
        }

        if (!selectedMethod) {
            setError("Please select a payment method.");
            return;
        }

        const newBalance = parseFloat(currentBalance) + parseFloat(amountValidation.roundedValue);

        const { error } = await supabase
            .from("users")
            .update({ balance: newBalance })
            .eq("user_id", userId);

        if (error) {
            setError("Failed to add funds.");
        } else {
            await supabase.from("history").insert([
                {
                    user_id: userId,
                    description: `Added $${amountValidation.roundedValue} via ${paymentMethods.find(pm => pm.payment_method_id === selectedMethod).payment_name}`
                }
            ]);

            updateBalance(newBalance); // Update balance in Dashboard
            setError("");
            closePopup();
            window.location.reload();
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Add Funds</h3>
                {error && <p className="text-danger">{error}</p>}

                <input
                    type="number"
                    class="form-control"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <select className="dropdown" value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
                    <option value="">Select Payment Method</option>
                    {paymentMethods.map((method) => (
                        <option key={method.payment_method_id} value={method.payment_method_id}>
                            {method.payment_name}
                        </option>
                    ))}
                </select>

                <button className="btn btn-primary" onClick={handleAddFunds}>Add Funds</button>
                <button className="btn btn-secondary" onClick={closePopup}>Cancel</button>
            </div>
        </div>
    );
};

export default AddFundsPopup;
