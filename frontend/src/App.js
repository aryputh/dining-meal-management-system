import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import MealPlan from "./pages/MealPlan";
import Menu from "./pages/Menu";
import Payment from "./pages/Payment";
import Feedback from "./pages/Feedback";
import UserManagement from "./pages/UserManagement";
import Analytics from "./pages/Analytics";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meal-plans" element={<MealPlan />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
