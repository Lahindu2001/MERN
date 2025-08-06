import React, { useState, useEffect, useRef } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import User from '../User/User';
import { useReactToPrint } from 'react-to-print';

const URL = 'http://localhost:5000/users';

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Users() {
  const [users, setUsers] = useState();
  const componentRef = useRef();

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Users Report',
    onAfterPrint: () => alert('User Report Successfully Downloaded!'),
  });

  return (
    <div>
      <Nav />
      <h1>User Details Display Page</h1>
      <div ref={componentRef}>
        {users &&
          users.map((user, i) => (
            <div key={i}>
              <User user={user} />
            </div>
          ))}
      </div>
      <button onClick={handlePrint}>Download Report</button>
    </div>
  );
}

export default Users;