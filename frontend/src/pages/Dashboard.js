import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="/"><button>Welcome</button></Link>
        <Link to="/dashboard"><button>Dashboard</button></Link>
        <Link to="/meal-plans"><button>Meal Plans</button></Link>
        <Link to="/menu"><button>Menu</button></Link>
        <Link to="/payment"><button>Payment</button></Link>
        <Link to="/feedback"><button>Feedback</button></Link>
        <Link to="/users"><button>User Management</button></Link>
        <Link to="/analytics"><button>Analytics</button></Link>
        <Link to="/orders"><button>Order History</button></Link>
      </nav>
    </div>
  );
}

export default Dashboard;
