import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import User from '../User/User';
import jsPDF from 'jspdf';  // Import jsPDF for direct PDF generation

const URL = 'http://localhost:5000/users';

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Users() {
  const [users, setUsers] = useState();

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, []);

  // Function to generate and download PDF directly
  const handleDownload = () => {
    if (!users || users.length === 0) {
      alert('No users to download!');
      return;
    }

    const doc = new jsPDF();
    let y = 10;  // Starting Y position for text

    doc.text('Users Report', 10, y);
    y += 10;

    users.forEach((user, index) => {
      doc.text(`User ${index + 1}:`, 10, y);
      y += 10;
      doc.text(`ID: ${user._id}`, 10, y);
      y += 10;
      doc.text(`Name: ${user.name}`, 10, y);
      y += 10;
      doc.text(`Gmail: ${user.gmail}`, 10, y);
      y += 10;
      doc.text(`Age: ${user.age}`, 10, y);
      y += 10;
      doc.text(`Address: ${user.address}`, 10, y);
      y += 20;  // Space between users
    });

    doc.save('users_report.pdf');  // Direct download
    alert('User Report Successfully Downloaded!');
  };

  return (
    <div>
      <Nav />
      <h1>User Details Display Page</h1>
      <div>
        {users &&
          users.map((user, i) => (
            <div key={i}>
              <User user={user} />
            </div>
          ))}
      </div>
      <button onClick={handleDownload}>Download Report</button>
    </div>
  );
}

export default Users;