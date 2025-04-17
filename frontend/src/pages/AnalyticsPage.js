import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const AnalyticsPage = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [paymentStats, setPaymentStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);

            const { data: orders, error } = await supabase.from("orders").select("*");

            if (error || !orders) {
                setLoading(false);
                return;
            }

            // Total revenue
            const total = orders.reduce((acc, o) => acc + parseFloat(o.total || 0), 0);
            setTotalRevenue(total.toFixed(2));

            // Payment method breakdown
            const { data: paymentMethods } = await supabase.from("payment_methods").select("*");
            const paymentMap = {};
            orders.forEach((order) => {
                paymentMap[order.payment_method_id] = (paymentMap[order.payment_method_id] || 0) + parseFloat(order.total || 0);
            });

            const paymentStatsData = Object.entries(paymentMap).map(([id, total]) => {
                const method = paymentMethods.find(p => p.payment_method_id === id);
                return {
                    methodName: method?.payment_name || "Unknown Payment Method",
                    total: total.toFixed(2),
                };
            });
            setPaymentStats(paymentStatsData);

            setLoading(false);
        };

        fetchAnalytics();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>Admin Analytics</h1>
            <button className="secondary-btn" onClick={() => window.location.href = "/dashboard"}>
                Dashboard
            </button>

            {loading ? (
                <p>Loading analytics...</p>
            ) : (
                <div>
                    <h2>Total Revenue</h2>
                    <p>${totalRevenue}</p>

                    <h2>Revenue by Payment Method</h2>
                    {paymentStats.length > 0 ? (
                        <ul>
                            {paymentStats.map((p, idx) => (
                                <li key={idx}>{p.methodName}: ${p.total}</li>
                            ))}
                        </ul>
                    ) : <p>No data</p>}
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;
