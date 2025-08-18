import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <div>
      <ul className="home-ul">
        <li className="home-li">
          <NavLink
            to="/mainAdminhome"
            className="home-a"
          >
            <h1>Admin Home</h1>
          </NavLink>
        </li>
        <li className="home-li">
          <NavLink
            to="/userdetails"
            className="home-a"
            activeClassName="active"
          >
            <h1>User Management</h1>
          </NavLink>
        </li>

        <li className="home-li">
          <NavLink
            to="/InventoryMange"
            className="home-a"
            activeClassName="active"
          >
            <h1>Inventory Management</h1>
          </NavLink>
        </li>

        
        {/* <li className="home-li">
          <NavLink
            to="/adduser"
            className="home-a"
            activeClassName="active"
          >
            <h1>Add User</h1>
          </NavLink>
        </li> */}
      </ul>
    </div>
  );
}

export default Nav;