import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function User(props) {
  const { _id, name, gmail, age, address } = props.user;
  const navigate = useNavigate();

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:5000/users/${_id}`);
      console.log("User deleted successfully");

      // Hard reload to refresh state after delete
      navigate('/userdetails'); // Navigate first
      window.location.reload(); // Then force reload the route
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <br />
      <h1>ID: {_id}</h1>
      <h1>Name: {name}</h1>
      <h1>Gmail: {gmail}</h1>
      <h1>Age: {age}</h1>
      <h1>Address: {address}</h1>
      <Link to={`/userdetails/${_id}`}>Update</Link>
      <button onClick={deleteHandler}>Delete</button>
      <br />
    </div>
  );
}

export default User;
