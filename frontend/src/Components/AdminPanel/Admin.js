import React from "react";
import { Link } from 'react-router-dom';



function Home() {
  return (
    <div className="home-container">

      <div className="dashboard">
        <h1 className="dashboard-title">Administrator Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to Solar ERP Admin Panel</p>

        <div className="card-grid">
          <div className="card">
          <Link to="/userdetails" className="active home-a">
            <h2>User Management</h2>
            <p>Manage system users, roles & permissions.</p>
          </Link>
            
          </div>
          <div className="card">
            <h2>Inventory Management</h2>
            <p>Track and update solar panels, wires & safety products.</p>
          </div>
          <div className="card">
            <h2>Package Management</h2>
            <p>Create and modify solar packages for customers.</p>
          </div>
          <div className="card">
            <h2>Finance Management</h2>
            <p>Monitor payments, invoices, and financial reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
