import React, { useState } from 'react'; 
import Nav from '../Nav/Nav';
import { useNavigate } from 'react-router-dom'; 
import axios from "axios";

function AddUser() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        name: "",
        gmail: "",
        age: "",
        address: "",
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

    const sendRequest = async () => {
        try {
            const response = await axios.post("http://localhost:5000/users", {
                name: String(inputs.name),
                gmail: String(inputs.gmail),
                age: Number(inputs.age),
                address: String(inputs.address),
            });
            console.log("Response:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error sending data:", error);
            throw error;
        }
    };

    return (
        <div>
            <Nav />
            <h1>Add User</h1>
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
    );
}

export default AddUser;