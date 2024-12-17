import React from 'react';
import { useEmployerRequest } from '../../../../storage/Employer/context';
import axios from 'axios';
import { BACKEND_URL } from '../../../../constant';
import { useLocation, useNavigate } from 'react-router-dom';
// Simple shimmer effect component
const Shimmer = () => (
  <div className="shimmer-wrapper-er">
    <div className="shimmer-er" />
  </div>
);

const EmployerRequestList = () => {
  const navigate = useNavigate();
  const { requests, loading, error } = useEmployerRequest();
  const handleDownload = async (requestID) => {
    try {
      const token = localStorage.getItem("token");

      // Make a GET request to download the Excel file
      const response = await axios.get(BACKEND_URL + `/employer/download_list/${requestID}`, {
        responseType: 'blob', // Ensure response type is blob
        headers: {
          'Authorization': token,
        },
      });

      // Check for a 400 Bad Request status
      if (response.status === 400) {
        throw new Error("No Student with given skills");
      }

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Set the filename and trigger the download
      link.setAttribute('download', `student_list_${requestID}.xlsx`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url); // Clean up object URL
      document.body.removeChild(link);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle 400 error specifically
        console.error('Error 400:', error.response.data.message || 'Bad Request');
        alert('No Student with given skills');
      } else {
        // Handle other types of errors
        console.error('Error downloading the file:', error);
        alert('No Student with given skills');
      }
    }
  };

  const goToJobApplicant = (id) => {
    navigate(`/employer/jobs/applications/${id}`);
	};
  

  // If loading, show shimmer effect
  if (loading) {
    return (
      <div className="shimmer-container-er">
        <Shimmer />
        <Shimmer />
        <Shimmer />
      </div>
    );
  }

  // If there's an error, display it
  if (error) {
    return <p className="error-message-er">{error}</p>;
  }

  // If there are no requests, show "No requests" message
  if (requests.length === 0) {
    return <p className="no-requests-message-er">No requests found.</p>;
  }

  return (
    <div className="employer-request-list-container-er">
      <h3 className="employer-request-heading-er">Recent Jobs</h3>
      <ul className="request-list-er">
        {requests.map((request) => (
          <li key={request.employerRequestID} className="request-item-er">
            <div className="request-content-er">
              <p><strong>Skills:</strong> {request.skill}</p>
              <p><strong>Skill Level:</strong> {request.skillLevel}</p>
              <p><strong>CGPA:</strong> {request.cgpa}</p>
              <p><strong>Branches:</strong> {request.branch}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <button className="download-button-er" onClick={() => handleDownload(request.employerRequestID)}>
                Download
              </button>

              <button className="ml-4 download-button-er" onClick={() => goToJobApplicant(request.employerRequestID)}>
                View
              </button>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployerRequestList;
