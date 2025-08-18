import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddUser.css'; // Import the CSS file

function AddUser() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    name: '',
    gmail: '',
    age: '',
    address: '',
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!inputs.name || !/^[a-zA-Z\s]+$/.test(inputs.name)) {
      alert('Name must contain only letters and spaces.');
      return;
    }
    if (
      !inputs.gmail ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputs.gmail)
    ) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!inputs.age || isNaN(inputs.age) || inputs.age < 0 || inputs.age > 120) {
      alert('Age must be a number between 0 and 120.');
      return;
    }
    if (!inputs.address) {
      alert('Address is required.');
      return;
    }

    console.log(inputs);
    sendRequest().then(() => history('/userdetails'));
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post('http://localhost:5000/users', {
        name: String(inputs.name),
        gmail: String(inputs.gmail),
        age: Number(inputs.age),
        address: String(inputs.address),
      });
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending data:', error);
      throw error;
    }
  };

  return (
    <>
      {/* ✅ Nav OUTSIDE the container */}
      <Nav />  

      <div className="add-user-container">
        <h1>Add User</h1>
        <form onSubmit={handleSubmit} className="add-user-form">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={inputs.name}
            required
            pattern="[A-Za-z\s]+"
            title="Only letters and spaces allowed"
          />

          <label htmlFor="gmail">Email</label>
          <input
            type="email"
            id="gmail"
            name="gmail"
            onChange={handleChange}
            value={inputs.gmail}
            required
          />

          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            onChange={handleChange}
            value={inputs.age}
            required
            min="0"
            max="120"
          />

          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            onChange={handleChange}
            value={inputs.address}
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default AddUser;
