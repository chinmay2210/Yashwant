import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';

const EmployerRequestsTable = () => {
    const [employerRequests, setEmployerRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetching data from the server
        const fetchEmployerRequests = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await axios.get(BACKEND_URL+'/employer/all_request',{
                  headers: {
                      'Authorization': token,
                      'Content-Type': 'application/json',
                  },
              }); // Replace with your actual API endpoint
                setEmployerRequests(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employer requests');
                setLoading(false);
            }
        };

        fetchEmployerRequests();
    }, []);

    const handleUpdateClick = (request) => {
        // Implement your update logic here
        console.log('Update:', request);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`/api/employer-requests/${id}`); // Replace with your actual delete API
            setEmployerRequests(employerRequests.filter((req) => req.employerRequestID !== id));
        } catch (err) {
            setError('Failed to delete request');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="tl" id="vc">
            <table className="ctble">
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Skill</th>
                        <th>Skill Level</th>
                        <th>CGPA</th>
                        <th>Branch</th>
                        <th>Has Skill Certificate</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employerRequests.map((request, index) => (
                        <tr key={request.employerRequestID}>
                            <td>{index + 1}</td>
                            <td>{request.skill}</td>
                            <td>{request.skillLevel}</td>
                            <td>{request.cgpa}</td>
                            <td>{request.branch}</td>
                            <td>{request.hasSkillCertificate}</td>
                            <td>{request.jobCount}</td>
                            <td>
                                <button onClick={() => handleUpdateClick(request)}>Update</button>
                                <br />
                                <button onClick={() => handleDeleteClick(request.employerRequestID)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployerRequestsTable;
