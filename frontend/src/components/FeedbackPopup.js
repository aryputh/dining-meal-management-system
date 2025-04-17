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
                <h3>Submit Feedback</h3>
                {error && <p className="error-text">{error}</p>}
                <textarea
                    class="form-control"
                    placeholder="Enter your feedback"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                />
                <select class="dropdown-header" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option class="dropdown-item" key={num} value={num}>{num} Star{num > 1 && "s"}</option>
                    ))}
                </select>
                <button className="btn btn-primary" onClick={submitFeedback}>Send Feedback</button>
                <button className="btn btn-secondary" onClick={closePopup}>Cancel</button>
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
                <h3>Feedback</h3>
                {loading ? (
                    <p>Loading feedback...</p>
                ) : feedbackList.length > 0 ? (
                    <div className="feedback-container">
                        {feedbackList.map((feedback, index) => (
                            <div key={index} className="feedback-card">
                                <p><strong>Feedback {new Date(feedback.created_at).toLocaleString()} - {feedback.rating} stars</strong></p>
                                <p>{feedback.feedback_text}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No feedback available.</p>
                )}
                <button className="btn btn-secondary" onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export { FeedbackPopup, ViewFeedback };
