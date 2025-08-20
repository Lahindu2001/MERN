import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './User.css'; // Import the CSS file

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
    <div className="user-card">
      <h3><strong>ID:</strong> {_id}</h3>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Gmail:</strong> {gmail}</p>
      <p><strong>Age:</strong> {age}</p>
      <p><strong>Address:</strong> {address}</p>
      <div className="button-container no-print">
        <Link to={`/userdetails/${_id}`} className="update-button">Update</Link>
        <button className="delete-button" onClick={deleteHandler}>Delete</button>
      </div>
    </div>
  );
}

export default User;