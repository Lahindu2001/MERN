import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import User from '../User/User';
import jsPDF from 'jspdf';
import './Users.css'; // Import the CSS file

const URL = 'http://localhost:5000/users';

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Users() {
  const [users, setUsers] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    gmail: true,
    age: true,
    address: true,
  });
  const [ageFilter, setAgeFilter] = useState('all');

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, []);

  const handleDownload = () => {
    if (!users || users.length === 0) {
      alert('No users to download!');
      return;
    }

    const doc = new jsPDF();
    let y = 10;

    doc.text('Users Report', 10, y);
    y += 10;

    const filteredUsers = ageFilter === 'all' 
      ? users 
      : users.filter(user => {
          const age = Number(user.age);
          switch (ageFilter) {
            case '0-20': return age >= 0 && age <= 20;
            case '21-40': return age >= 21 && age <= 40;
            case '41-60': return age >= 41 && age <= 60;
            case '61+': return age >= 61;
            default: return true;
          }
        });

    filteredUsers.forEach((user, index) => {
      doc.text(`User ${index + 1}:`, 10, y);
      y += 10;
      if (selectedFields.name) doc.text(`Name: ${user.name}`, 10, y); y += 10;
      if (selectedFields.gmail) doc.text(`Gmail: ${user.gmail}`, 10, y); y += 10;
      if (selectedFields.age) doc.text(`Age: ${user.age}`, 10, y); y += 10;
      if (selectedFields.address) doc.text(`Address: ${user.address}`, 10, y); y += 10;
      y += 10; // Space between users
    });

    doc.save('users_report.pdf');
    alert('User Report Successfully Downloaded!');
  };

  const filteredUsers = users ? users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.gmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user._id.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="users-container">
      <Nav />
      <h2>User Details Display Page</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name, Email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="download-options">
        <h3>Download Options</h3>
        <label>
          <input
            type="checkbox"
            checked={selectedFields.name}
            onChange={() => setSelectedFields(prev => ({ ...prev, name: !prev.name }))}
          /> Name
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedFields.gmail}
            onChange={() => setSelectedFields(prev => ({ ...prev, gmail: !prev.gmail }))}
          /> Gmail
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedFields.age}
            onChange={() => setSelectedFields(prev => ({ ...prev, age: !prev.age }))}
          /> Age
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedFields.address}
            onChange={() => setSelectedFields(prev => ({ ...prev, address: !prev.address }))}
          /> Address
        </label>
        <div>
          <label>Filter by Age Range: </label>
          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="0-20">0-20</option>
            <option value="21-40">21-40</option>
            <option value="41-60">41-60</option>
            <option value="61+">61+</option>
          </select>
          <button onClick={handleDownload}>Download Report</button>
        </div>
      </div>
      <div className="users-list">
        {filteredUsers.map((user, i) => (
          <div key={i}>
            <User user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;