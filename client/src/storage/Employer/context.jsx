import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';

// Create EmployerRequestContext
const EmployerRequestContext = createContext();

// Create a custom hook to easily access context values
export const useEmployerRequest = () => useContext(EmployerRequestContext);

// EmployerRequestProvider component to provide the context
export const EmployerRequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployerRequests = async () => {
      try {
        // Get the employerID and token from localStorage
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const { employerID } = user;

        // Set up Axios request with token
        const config = {
          headers: {
            Authorization: token,
          },
        };

        // Fetch the employer requests from API
        const response = await axios.get(`${BACKEND_URL}/employer/fetch_request/${employerID}`, config);

        // Set the data into state
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching requests');
        setLoading(false);
      }
    };

    // Trigger the data fetch on component mount
    fetchEmployerRequests();
  }, []);

  // Provide requests, loading, and error to the context consumers
  return (
    <EmployerRequestContext.Provider value={{ requests, loading, error }}>
      {children}
    </EmployerRequestContext.Provider>
  );
};
