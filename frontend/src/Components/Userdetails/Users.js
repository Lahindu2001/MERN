import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import User from '../User/User';
import jsPDF from 'jspdf';
import './Users.css';

// ------------------- API URL -------------------
const URL = 'http://localhost:5000/users';

// ------------------- API FETCH HANDLER -------------------
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Users() {
  // ------------------- STATE VARIABLES -------------------
  const [users, setUsers] = useState([]); // store all users from DB
  const [searchTerm, setSearchTerm] = useState(''); // live search input
  const [selectedFields, setSelectedFields] = useState({ // fields to include in PDF
    name: true,
    gmail: true,
    age: true,
    address: true,
  });
  const [ageFilter, setAgeFilter] = useState('all'); // dropdown age filter for PDF + list
  const [inputs, setInputs] = useState({ // form input fields
    name: '',
    gmail: '',
    age: '',
    address: '',
  });
  const [showAddUserForm, setShowAddUserForm] = useState(false); // toggle add-user form

  // ------------------- FETCH USERS FROM BACKEND -------------------
  useEffect(() => {
    fetchHandler()
      .then((data) => {
        setUsers(data.users || []); // put response inside state
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setUsers([]); // in case of error, set empty list
      });
  }, []);

  // ------------------- PDF DOWNLOAD FUNCTION -------------------
  const handleDownload = () => {
    // If no users exist, stop
    if (!users || users.length === 0) {
      alert('No users to download!');
      return;
    }

    // Create a new PDF document
    const doc = new jsPDF();
    let y = 20; // Y-axis cursor (start position for text)

    // ----------- TITLE SECTION (Centered) -----------
    doc.setFont("helvetica", "bold"); // font style
    doc.setFontSize(16); // font size
    const pageWidth = doc.internal.pageSize.getWidth(); // page width
    const title = "Users Report"; // report heading
    const textWidth = doc.getTextWidth(title); // measure title text width
    doc.text(title, (pageWidth - textWidth) / 2, 15); // place title in middle (x=half width)

    // ----------- RESET FONT FOR BODY -----------
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // ----------- FILTER USERS BY AGE RANGE -----------
    const filteredUsers = ageFilter === 'all'
      ? users
      : users.filter(user => {
          const age = Number(user?.age || 0);
          switch (ageFilter) {
            case '0-20': return age >= 0 && age <= 20;
            case '21-40': return age >= 21 && age <= 40;
            case '41-60': return age >= 41 && age <= 60;
            case '61+': return age >= 61;
            default: return true;
          }
        });

    // ----------- LOOP THROUGH USERS AND WRITE DATA -----------
    filteredUsers.forEach((user, index) => {
      // User Header (bold)
      doc.setFont("helvetica", "bold");
      doc.text(`User ${index + 1}`, 10, y); // Example: "User 1"
      y += 8; // move cursor down

      // User Details (normal font)
      doc.setFont("helvetica", "normal");

      // Conditionally include fields based on checkbox selection
      if (selectedFields.name && user?.name) {
        doc.text(`Name     : ${user.name}`, 20, y);
        y += 7; // space after line
      }
      if (selectedFields.gmail && user?.gmail) {
        doc.text(`Email    : ${user.gmail}`, 20, y);
        y += 7;
      }
      if (selectedFields.age && user?.age) {
        doc.text(`Age      : ${user.age}`, 20, y);
        y += 7;
      }
      if (selectedFields.address && user?.address) {
        doc.text(`Address  : ${user.address}`, 20, y);
        y += 7;
      }

      // Extra space between each user
      y += 5;

      // ----------- PAGE BREAK HANDLING -----------
      // If content goes beyond page bottom, add a new page
      if (y > 270) { // 270px ~ bottom of A4 page
        doc.addPage();
        y = 20; // reset Y cursor to top of new page
      }
    });

    // ----------- SAVE PDF FILE -----------
    doc.save("users_report.pdf");
    alert("User Report Successfully Downloaded!");
  };

  // ------------------- HANDLE INPUT CHANGE -------------------
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value, // update form state
    }));
  };

  // ------------------- ADD NEW USER -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ----------- VALIDATION RULES -----------
    if (!inputs.name || !/^[a-zA-Z\s]+$/.test(inputs.name)) {
      alert('Name must contain only letters and spaces.');
      return;
    }
    if (!inputs.gmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputs.gmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!inputs.age || isNaN(inputs.age) || inputs.age < 0 || inputs.age > 120) {
      alert('Age must be a number between 0 and 120.');
      return;
    }
    if (!inputs.address) {
      alert('Address is required.');
      return;
    }

    // ----------- SUBMIT TO BACKEND -----------
    try {
      const response = await axios.post(URL, {
        name: String(inputs.name),
        gmail: String(inputs.gmail),
        age: Number(inputs.age),
        address: String(inputs.address),
      });

      // Add new user to state
      setUsers([...users, response.data]);

      // Reset form + hide it
      setInputs({ name: '', gmail: '', age: '', address: '' });
      setShowAddUserForm(false);

      alert('User added successfully!');
      window.location.reload(); // refresh list
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again.');
    }
  };

  // ------------------- SEARCH FILTER -------------------
  const filteredUsers = users ? users.filter(user =>
    (user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user?.gmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user?._id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) : [];

  // ------------------- RENDER JSX -------------------
  return (
    <div className="users-section">
      <Nav />
      <div className="title-container">
        <h2 className="Title">User Management</h2>
        <span className="user-count">Total Users: {users.length}</span>
      </div>

      {/* Toggle Add User Form */}
      <button
        onClick={() => setShowAddUserForm(!showAddUserForm)}
        className="add-user-toggle"
      >
        {showAddUserForm ? 'Hide Add User Form' : 'Show Add User Form'}
      </button>

      {/* Add User Form */}
      {showAddUserForm && (
        <div className="add-user-container">
          <h3>Add New User</h3>
          <form onSubmit={handleSubmit} className="add-user-form">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={inputs.name}
              required
              pattern="[A-Za-z\s]+"
              title="Only letters and spaces allowed"
            />
            <label htmlFor="gmail">Email</label>
            <input
              type="email"
              id="gmail"
              name="gmail"
              onChange={handleChange}
              value={inputs.gmail}
              required
            />
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              onChange={handleChange}
              value={inputs.age}
              required
              min="1"
              max="120"
            />
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              onChange={handleChange}
              value={inputs.address}
              required
            />
            <button type="submit">Add User</button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name, Email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Download Options */}
      <div className="download-options">
        <h3>Download Options</h3>
        {/* Field selectors for PDF */}
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

        {/* Age filter dropdown + Download button */}
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

      {/* Display Users */}
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
