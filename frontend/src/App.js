import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom'; // Added Navigate for redirection
import './App.css';
import Home from "./Components/Home/Home.js";
import AddUser from "./Components/AddUser/AddUser.js";
import Users from "./Components/Userdetails/Users.js";
import UpdateUser from "./Components/UpdateUser/UpdateUser.js";
import AdminPanel from "./Components/AdminPanel/Admin.js";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          {/* Redirect root path (/) to /mainAdminhome on initial load or reload */}
          <Route path="/" element={<Navigate to="/mainAdminhome" replace />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/userdetails" element={<Users />} />
          <Route path="/userdetails/:id" element={<UpdateUser />} />
          <Route path="/mainAdminhome" element={<AdminPanel />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;