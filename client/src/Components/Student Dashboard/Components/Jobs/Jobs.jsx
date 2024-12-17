import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../../constant";

const Jobs = () => {
  const [jobRequests, setJobRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobRequests = async (token) => {
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/job/jobs`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setJobRequests(response.data);
      } catch (error) {
        console.error("Error fetching job requests:", error);
        setMessage("Error fetching job requests.");
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    if (token) {
      fetchJobRequests(token);
    } else {
      setMessage("No token found.");
      setLoading(false);
    }
  }, []);

  const applyForJob = async (jobId) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const studentId = storedUser?.id; // Get student ID from localStorage
    const token = localStorage.getItem("token"); // Get token from localStorage
  
    if (!studentId || !token) {
      setMessage("User not authenticated.");
      return;
    }
  
    try {
      // Apply for the job
      const response = await axios.post(`${BACKEND_URL}/job/apply`, {
        employerRequestID: jobId,
        studentID: studentId,
      }, {
        headers: {
          Authorization: `${token}`,
        },
      });
  
      // Check the response for application status
      if (response.data.applied) {
        setMessage("You have already applied for this job.");
      } else {
        setMessage(`Successfully applied for job ID: ${jobId}`);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      setMessage("Error applying for job.");
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Job Requests</h2>

      {loading && <p className="text-center">Loading job requests...</p>}
      {message && <p className="text-center text-red-500">{message}</p>}

      {jobRequests.length > 0 ? (
        <div>
          {jobRequests.map((job) => (
            <div key={job.employerRequestID} className="border-b border-gray-300 py-4">
              <h3 className="text-xl font-semibold">{job.employerName}</h3>
              <p className="text-gray-700">Skill: {job.skill}</p>
              <p className="text-gray-700">Skill Level: {job.skillLevel}</p>
              <p className="text-gray-700">CGPA: {job.cgpa}</p>
              <p className="text-gray-700">Branch: {job.branch}</p>
              <p className="text-gray-700">Skill Certificate: {job.hasSkillCertificate}</p>
              <p className="text-gray-700">Status: {job.status}</p>
              <button
                onClick={() => applyForJob(job.employerRequestID)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Apply for Job
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No job requests found.</p>
      )}
    </div>
  );
};

export default Jobs;
