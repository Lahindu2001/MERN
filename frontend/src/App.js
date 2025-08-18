import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';

// ------------------- Import Components -------------------

import Users from "./Components/Userdetails/Users";
import AdminPanel from "./Components/AdminPanel/Admin";
import InventoryMange from "./Components/InventoryMange/InventoryMange";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Redirect root to mainAdminhome */}
        <Route path="/" element={<Navigate to="/mainAdminhome" replace />} />

        {/* Home Pages */}
     
        <Route path="/mainAdminhome" element={<AdminPanel />} />

        {/* User Management */}
      
        <Route path="/userdetails" element={<Users />} /> {/* All CRUD handled here */}

        {/* Inventory Management */}
        <Route path="/InventoryMange" element={<InventoryMange />} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
