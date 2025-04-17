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
        <div>
            <ul>
                {history.length > 0 ? (
                    history.slice(0, 4).map((entry, index) => {
                        const formattedTime = new Date(entry.timestamp).toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        });

                        return (
                            <li key={index}>
                                <strong>{formattedTime}</strong>
                                <br />
                                <span>{entry.description}</span>
                            </li>
                        );
                    })
                ) : (
                    <p className="card-text">No history available.</p>
                )}
            </ul>
        </div>
    );
};

export default History;
