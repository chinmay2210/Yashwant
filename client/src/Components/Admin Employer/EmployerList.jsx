import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import axios from 'axios';
import { BACKEND_URL } from '../../constant';

const EmployersTable = () => {
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployers = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(BACKEND_URL + '/employer/employers', {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                }); // Replace with your actual API endpoint
                setEmployers(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employers');
                setLoading(false);
            }
        };

        fetchEmployers();
    }, []);

    // Function to handle employer approval
    const handleApproveEmployer = async (employerID) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(`${BACKEND_URL}/employer/approve/${employerID}`, {}, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            // Assuming the response contains updated employer data
            alert(response.data.message); // Notify the user of success
            // Optionally refetch employers to update the state
            const updatedEmployers = employers.map((employer) => 
                employer.employerID === employerID ? { ...employer, status: 'Approved' } : employer
            );
            setEmployers(updatedEmployers);
        } catch (err) {
            console.error('Error approving employer:', err);
            setError('Failed to approve employer');
        }
    };

    const handleViewRequests = (employerID) => {
        navigate(`/admin/employers/${employerID}/requests`); // Navigates to the requests page for the selected employer
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
                        <th>Employer Name</th>
                        <th>Employer Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>View Request</th>
                    </tr>
                </thead>
                <tbody>
                    {employers.map((employer, index) => (
                        <tr key={employer.employerID}>
                            <td>{index + 1}</td>
                            <td>{employer.employerName}</td>
                            <td>{employer.employerEmail}</td>
                            <td>{employer.status}</td>
                            <td>
                                <button onClick={() => handleApproveEmployer(employer.employerID)}>
                                    Approve Employer
                                </button>
                            </td>
                            <td>
                                <button onClick={() => handleViewRequests(employer.employerID)}>
                                    View Requests
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployersTable;
