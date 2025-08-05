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
        console.log(inputs);
        sendRequest().then(() => history('/userdetals')); 
    };

    const sendRequest = async () => {
        try {
            const response = await axios.post("http://localhost:5000/users", {
                name: String(inputs.name),
                gmail: String(inputs.gmail),
                age: Number(inputs.age),
                address: String(inputs.address),
            });
            console.log("Response:", response.data); // Added for debugging
            return response.data;
        } catch (error) {
            console.error("Error sending data:", error); // Added error handling
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
                <input type="text" name="name" onChange={handleChange} value={inputs.name} required /><br /><br />
                <label>gmail</label>
                <br />
                <input type="email" name="gmail" onChange={handleChange} value={inputs.gmail} required /><br /><br /> 
                <label>age</label>
                <br />
                <input type="text" name="age" onChange={handleChange} value={inputs.age} required /><br /><br />
                <label>address</label>
                <br />
                <input type="text" name="address" onChange={handleChange} value={inputs.address} required /><br /><br />
                <button type="submit">Submit</button> 
            </form>
        </div>
    );
}

export default AddUser;