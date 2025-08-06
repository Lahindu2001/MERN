// src/Components/User/User.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function User({ user }) {
  const { _id, name, gmail, age, address } = user;
  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/users/${_id}`);
      console.log("User deleted successfully");

      navigate('/userdetails');
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '15px',
      margin: '15px 0',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3><strong>ID:</strong> {_id}</h3>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Gmail:</strong> {gmail}</p>
      <p><strong>Age:</strong> {age}</p>
      <p><strong>Address:</strong> {address}</p>

      {/* Buttons are hidden only when printing */}
      <div className="no-print">
        <Link to={`/userdetails/${_id}`}><button>Update</button></Link>
        &nbsp;
        <button onClick={deleteHandler}>Delete</button>
      </div>
    </div>
  );
}

export default User;
