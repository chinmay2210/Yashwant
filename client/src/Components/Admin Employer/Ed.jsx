import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';

const EmployerRequests = () => {
    const { employerID } = useParams(); // Gets employerID from the route params
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployerRequests = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${BACKEND_URL}/employer/fetch_request/${employerID}`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
                setRequests(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch requests');
                setLoading(false);
            }
        };

        fetchEmployerRequests();
    }, [employerID]);

    // Function to update status to "Approved"
    const handleApproveClick = async (requestID) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`${BACKEND_URL}/employer/update_request/${requestID}`, 
            { status: 'Approved' },
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            // Update the status locally after successful update
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.employerRequestID === requestID
                        ? { ...request, status: 'Approved' }
                        : request
                )
            );
        } catch (err) {
            setError('Failed to update status');
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
                        <th>Job Count</th>
                      
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request, index) => (
                        <tr key={request.employerRequestID}>
                            <td>{index + 1}</td>
                            <td>{request.skill}</td>
                            <td>{request.skillLevel}</td>
                            <td>{request.cgpa}</td>
                            <td>{request.branch}</td>
                            <td>{request.hasSkillCertificate}</td>
                            <td>{request.jobCount}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployerRequests;
