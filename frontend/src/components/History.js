import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const History = ({ userId }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const { data, error } = await supabase
            .from("history")
            .select("description, timestamp")
            .eq("user_id", userId)
            .order("timestamp", { ascending: false });

        if (!error) {
            setHistory(data);
        }
    };

    return (
        <div className="history-card">
            <h4>History</h4>
            <div className="history-list">
                {history.length > 0 ? (
                    history.map((entry, index) => (
                        <div key={index} className="history-entry">
                            <p>{entry.description}</p>
                            <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                    ))
                ) : (
                    <p>No history available.</p>
                )}
            </div>
        </div>
    );
};

export default History;
