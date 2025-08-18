import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active link styling
import './Nav.css';

function Nav() {
  return (
    <div>
      <ul className="home-ul">
        <li className="home-li">
          {/* NavLink for Admin Home, no active styling applied */}
          <NavLink
            to="/mainAdminhome"
            className="home-a"
            // No activeClassName or isActive to prevent active styling
          >
            <h1>Admin Home</h1>
          </NavLink>
        </li>
        <li className="home-li">
          {/* NavLink for User Management, applies active styling when on /userdetails */}
          <NavLink
            to="/userdetails"
            className="home-a"
            activeClassName="active" // Apply 'active' class when the link is active
          >
            <h1>User Management</h1>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Nav;