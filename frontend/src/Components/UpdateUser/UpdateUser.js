import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

function UpdateUser() {
    const [inputs, setInputs] = useState({});
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
        console.log(inputs);
        sendRequest().then(() => history('/userdetails')); 
    };

  return (
    <div>
      <h1>update user</h1>
      <form onSubmit={handleSubmit}>
                <label>name</label>
                <br />
                <input type="text" name="name" onChange={handleChange} value={inputs.name} required /><br /><br />
                <label>gmail</label>
                <br />
                <input type="email" name="gmail" onChange={handleChange} value={inputs.gmail } required /><br /><br /> 
                <label>age</label>
                <br />
                <input type="text" name="age" onChange={handleChange} value={inputs.age } required /><br /><br />
                <label>address</label>
                <br />
                <input type="text" name="address" onChange={handleChange} value={inputs.address } required /><br /><br />
                <button type="submit">Submit</button> 
            </form>
    </div>
  )
}

export default UpdateUser