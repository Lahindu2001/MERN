import React from "react";
import { Route ,Routes } from 'react-router-dom';
import './App.css';
import Home from "./Components/Home/Home.js";
import AddUser from "./Components/AddUser/AddUser.js";
import Users from "./Components/Userdetails/Users.js";
import UpdateUser from "./Components/UpdateUser/UpdateUser.js";

function App() {
  return (
    <div>
      
      <React.Fragment>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/mainhome" element={<Home/>}/>
        <Route path="/adduser" element={<AddUser/>}/>
        <Route path="/userdetals" element={<Users/>}/>
        <Route path="/userdetals/:id" element={<UpdateUser/>}/>

        </Routes>
      </React.Fragment>

    </div>
  );
}

export default App;
