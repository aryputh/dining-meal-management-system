import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const FeedbackPopup = ({ closePopup, userId }) => {
    const [feedbackText, setFeedbackText] = useState("");
    const [rating, setRating] = useState(1);
    const [error, setError] = useState("");

    const submitFeedback = async () => {
        if (!feedbackText.trim()) {
            setError("Feedback text is required.");
            return;
        }

        const { error } = await supabase.from("feedback").insert([
            { user_id: userId, feedback_text: feedbackText, rating }
        ]);

        if (error) {
            setError("Failed to submit feedback.");
        } else {
            alert("Feedback submitted successfully!");
            setFeedbackText("");
            setRating(1);
            closePopup();
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h4>Submit Feedback</h4>
                {error && <p className="text-danger">{error}</p>}
                <textarea
                    className="form-control"
                    placeholder="Enter your feedback"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                />
                <select className="dropdown-header" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option className="dropdown-item" key={num} value={num}>{num} Star{num > 1 && "s"}</option>
                    ))}
                </select>
                {/* <br /> */}
                <button className="btn btn-primary me-1" onClick={submitFeedback}>Send Feedback</button>
                <button className="btn btn-secondary me-1" onClick={closePopup}>Cancel</button>
            </div>
        </div>
    );
};

const ViewFeedback = ({ closePopup }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("feedback")
            .select("feedback_text, rating, created_at")
            .order("created_at", { ascending: false });

        if (!error) {
            setFeedbackList(data);
        }
        setLoading(false);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h4>Feedback</h4>
                {loading ? (
                    <p>Loading feedback...</p>
                ) : feedbackList.length > 0 ? (
                    <div className="feedback-container">
                        {feedbackList.map((feedback, index) => {
                            const date = new Date(feedback.created_at).toLocaleString('en-US', {
                                month: '2-digit',
                                day: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            });
                            return (
                                <div key={index} className="card bg-secondary mb-3">
                                    <div className="card-header">
                                        Feedback at {date}
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text"><strong>{feedback.rating} stars</strong><br />{feedback.feedback_text}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No feedback available.</p>
                )}
                <button className="btn btn-secondary" onClick={closePopup}>
                    Close
                </button>
            </div>
        </div>
    );
};

export { FeedbackPopup, ViewFeedback };
