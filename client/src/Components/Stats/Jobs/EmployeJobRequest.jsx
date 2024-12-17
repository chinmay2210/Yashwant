import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../constant';
import TableSection from '../Table'; // Import your TableSection component

const EmployerJobRequests = () => {
    const [employerRequests, setEmployerRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployerRequests = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${BACKEND_URL}/employer/all_request`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });

                // Directly use the response data since it already contains jobCount
                setEmployerRequests(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employer requests');
                setLoading(false);
            }
        };

        fetchEmployerRequests();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const headers = ['Request ID', 'Skill', 'Skill Level', 'CGPA', 'Branch', 'Has Certificate', 'Status', 'Job Count'];

    const data = employerRequests.map((request) => ({
        employerRequestID: request.employerRequestID,
        skill: request.skill,
        skillLevel: request.skillLevel,
        cgpa: request.cgpa,
        branch: request.branch,
        hasSkillCertificate: request.hasSkillCertificate,
        status: request.status,
        jobCount: request.jobCount, // Already included in the response
    }));

    return (
        <div className="employer-requests">
            <h2 className="text-xl font-bold">Employer Requests</h2>
            <TableSection title="Employer Requests" data={data} headers={headers} expandedData={data} />
        </div>
    );
};

export default EmployerJobRequests;
