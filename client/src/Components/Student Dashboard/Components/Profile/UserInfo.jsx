import React, { useState, useEffect } from 'react';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    // Retrieve the user data from localStorage
    const userData = localStorage.getItem('user');

    // If user data is found, parse it
    if (userData) {
      const parsedData = JSON.parse(userData);

      // Map the parsed data to the expected structure and set state
      const formattedData = [{
        id: parsedData["id"],
        name: parsedData["Name of Student"],
        branch: parsedData["Branch"],
        section: parsedData["Section"],
        collegeID: parsedData["College ID"],
        
      }];

      setUserInfo(formattedData);
    }
  }, []);

  if (userInfo.length === 0) return <div>No user data available.</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {userInfo.map((user) => (
        <div key={user.id} className="p-4 bg-gray-100 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold text-blue-500">{user.name}</h2>
          <p className="mt-2 text-gray-700"><strong>Branch:</strong> {user.branch}</p>
          <p className="mt-2 text-gray-700"><strong>Section:</strong> {user.section}</p>
          <p className="mt-2 text-gray-700"><strong>College ID:</strong> {user.collegeID}</p>
        
        </div>
      ))}
    </div>
  );
};

export default UserInfo;
