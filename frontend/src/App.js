import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import AccessDenied from "./pages/AccessDenied";
import supabase from "./supabaseClient";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Welcome setUser={setUser} />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/access-denied" />} />
                <Route path="/analytics" element={user ? <AnalyticsPage /> : <Navigate to="/access-denied" />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/access-denied"} />} />
            </Routes>
        </Router>
    );
}

export default App;
