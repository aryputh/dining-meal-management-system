import React, { useEffect, useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
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
                {loading ? (
                    <p>Loading analytics...</p>
                ) : (
                    <div>
                        <div className="card bg-secondary mb-3">
                            <div className="card-header">Revenue by Payment Method</div>
                            <div className="card-body">
                                {paymentStats.length > 0 ? (
                                    <>
                                        <ul>
                                            {paymentStats.map((p, idx) => (
                                                <li key={idx}>
                                                    <strong>{p.methodName}</strong><br />
                                                    {((p.total / totalRevenue) * 100).toFixed(2)}% (${p.total})
                                                </li>
                                            ))}
                                        </ul>

                                        <PieChart
                                            series={[
                                                {
                                                    data: paymentStats.map((p, idx) => ({
                                                        id: idx,
                                                        value: p.total,
                                                        label: p.methodName,
                                                    })),
                                                    innerRadius: 30,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    cornerRadius: 0,
                                                    startAngle: 0,
                                                    endAngle: 360,
                                                    cx: 150,
                                                    cy: 150,
                                                }
                                            ]}
                                            height={300}
                                            width={300}
                                        />
                                    </>
                                ) : <p>No data</p>}
                            </div>
                        </div>
                    </div>
                )}
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
                    </div>
                )}
            </div>
        </>
    );
};

export default AnalyticsPage;
