import React from "react";
import { Route ,Routes } from 'react-router-dom';
import './App.css';
import Home from "./Components/Home/Home.js";
import User from "./Components/AddUser/User.js";
import Users from "./Components/Userdetails/Users.js";

function App() {
  return (
    <div>
      
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/mainhome" element={<Home/>}/>
        <Route path="/adduser" element={<User/>}/>
        <Route path="/userdetals" element={<Users/>}/>
        </Routes>
      </React.Fragment>

    </div>
  );
}

export default App;
