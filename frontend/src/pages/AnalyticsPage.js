import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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
        <>
            <Navbar />
        <div className="dashboard-container">
            <h2>Admin Analytics</h2>
            {loading ? (
                <p>Loading analytics...</p>
            ) : (
                <div>
                    <div className="card bg-secondary mb-3">
                        <div className="card-header">Total Revenue</div>
                        <div className="card-body">
                            <p className="card-text">For all orders for all of time: ${totalRevenue}</p>
                        </div>
                    </div>
                    <div className="card bg-secondary mb-3">
                        <div className="card-header">Revenue by Payment Method</div>
                        <div className="card-body">
                            {paymentStats.length > 0 ? (
                                <ul>
                                    {paymentStats.map((p, idx) => (
                                        <li key={idx}><strong>{p.methodName}</strong><br />{((p.total / totalRevenue) * 100).toFixed(2)}% (${p.total})</li>
                                    ))}
                                </ul>
                            ) : <p>No data</p>}
                        </div>
                    </div>
                </div>
            )}
            <button className="btn btn-secondary" onClick={() => window.location.href = "/dashboard"}>Dashboard</button>
        </div>
        </>
    );
};

export default AnalyticsPage;
