import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../../constant"; import { useLocation, useNavigate } from 'react-router-dom';
const JobApplications = () => {
    const { employerRequestID } = useParams();
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate()
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/employer/job/${employerRequestID}`, {
                    headers: {
                        Authorization: `${token}`, // Use the token for authentication
                    },
                });
                setApplications(response.data.data);
            } catch (err) {
                console.error("Error fetching job applications:", err);
                setError(err.response?.data?.message || "An error occurred while fetching job applications.");
            }
        };

        fetchApplications();
    }, [employerRequestID, token]);

    const resume = (id) => {
        navigate(`/employer/resume?studentID=${id}`);
    };

    return (
        <>

            <div className="mt-20">
                <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-center">Job Applications</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {applications.length > 0 ? (
                        <table className="min-w-full table-auto border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">Student ID</th>
                                    <th className="border px-4 py-2">Name</th>
                                    <th className="border px-4 py-2">Branch</th>
                                    <th className="border px-4 py-2">Section</th>
                                    <th className="border px-4 py-2">Mobile</th>
                                    <th className="border px-4 py-2">Email</th>
                                    <th className="border px-4 py-2">Resume</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((application) => (
                                    <tr key={application.studentID} className="hover:bg-gray-100">
                                        <td className="border px-4 py-2">{application.studentID}</td>
                                        <td className="border px-4 py-2">{application.studentName}</td>
                                        <td className="border px-4 py-2">{application.studentBranch}</td>
                                        <td className="border px-4 py-2">{application.studentSection}</td>
                                        <td className="border px-4 py-2">{application.studentMobile}</td>
                                        <td className="border px-4 py-2">{application.studentEmail}</td>

                                        <td className="border px-4 py-2"><button
                                            onClick={() => resume(application.studentID)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            Resume
                                        </button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center">No students have applied for this job.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default JobApplications;
