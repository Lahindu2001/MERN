import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import "./UpdateUser.css";

function UpdateUser() {
    const [inputs, setInputs] = useState({
        name: "",
        gmail: "",
        age: "",
        address: "",
    });
    const history = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            await axios
            .get(`http://localhost:5000/users/${id}`)
            .then((res) => res.data)
            .then((data) => setInputs(data.user));  
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/users/${id}`, {
        name: String(inputs.name),
        gmail: String(inputs.gmail),
        age: Number(inputs.age),
        address: String(inputs.address),
        })
        .then((res) => res.data);
    };

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
            alert("Name must contain only letters and spaces.");
            return;
        }
        if (!inputs.gmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputs.gmail)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!inputs.age || isNaN(inputs.age) || inputs.age < 0 || inputs.age > 120) {
            alert("Age must be a number between 0 and 120.");
            return;
        }
        if (!inputs.address) {
            alert("Address is required.");
            return;
        }

        console.log(inputs);
        sendRequest().then(() => history('/userdetails')); 
    };

  return (
    <div className="update-user-container">
      <h1>update user</h1>
      <form onSubmit={handleSubmit}>
                <label>name</label>
                <br />
                <input type="text" name="name" onChange={handleChange} value={inputs.name} required pattern="[A-Za-z\s]+" title="Only letters and spaces allowed" /><br /><br />
                <label>gmail</label>
                <br />
                <input type="email" name="gmail" onChange={handleChange} value={inputs.gmail} required /><br /><br /> 
                <label>age</label>
                <br />
                <input type="number" name="age" onChange={handleChange} value={inputs.age} required min="0" max="120" /><br /><br />
                <label>address</label>
                <br />
                <input type="text" name="address" onChange={handleChange} value={inputs.address} required /><br /><br />
                <button type="submit">Submit</button> 
            </form>
    </div>
  )
}

export default UpdateUser