import React, { useEffect, useState } from "react";
import Loader from "../../../../loader/loader";
import axios from "axios"; // Ensure Axios is installed and imported
import { BACKEND_URL } from "../../../../constant";

const Certification = () => {
  const [certificateName, setCertificateName] = useState("");
  const [organization, setOrganization] = useState("");
  const [certificatesList, setCertificatesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState(null);
  const handleAddCertificate = async (e) => {
    e.preventDefault();

    // Get token and user data from localStorage
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!certificateName || !organization || !user) {
      alert("Please fill all fields or ensure the user is logged in.");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/certificate/add_certificate`,
        {
          certificateName,
          certificateOrgnization: organization,
          studentId: user["id"], // Use the student ID from localStorage
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );


      if (response.status === 201) {
        setCertificatesList([...certificatesList, { certificateName, organization }]);
        setCertificateName("");
        setOrganization("");
        alert("Certificate added successfully!");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Unauthorized: Invalid or expired token. Please log in again.");
      }

      else if (error.response && error.response.status === 409) {
        alert("Conflict: This certificate already exists for the student.");
      }

      else if (error.response && error.response.status === 400) {
        alert("Bad Request: Please check the data you have entered.");
      }

      else if (error.response && error.response.status === 500) {
        alert("Internal Server Error: An error occurred on the server.");
      }

      // Catch any other errors
      else {
        alert("An unknown error occurred while adding the certificate.");
      }

      console.error("Error adding certificate:", error);
    }
  };


  useEffect(() => {
    const fetchCertificates = async () => {
      // Get token and user data from localStorage
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        alert("User is not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${BACKEND_URL}/certificate/fetch_certificate`, // Replace with your server endpoint
          {
            studentId: user["id"],
          },
          {
            headers: {
              Authorization: `${token}`, // Pass the token in the request headers
            },
          }
        );

        // Set the fetched certificates into the state
        if (response.status === 200 && response.data.success) {
          setCertificatesList(response.data.data); // Assuming data contains the certificates
        } else {
          alert(response.data.message || "Failed to fetch certificates.");
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
        alert("An error occurred while fetching certificates.");
      }

      // Set loading to false after fetching
      setIsLoading(false);
    };

    fetchCertificates();
  }, []); // Add an empty dependency array to run only on component mount


  const handleOpenModal = (index) => {
    setCurrentCertificate(certificatesList[index]);
    setIsModalOpen(true);
  };

  const handleDeleteCertificate = async (index) => {
    const token = localStorage.getItem("token");
    const certificateToDelete = certificatesList[index];
  
    try {
      const response = await axios.delete(`${BACKEND_URL}/certificate/delete_certificate`, {
        data: { certificateID: certificateToDelete.certificateID }, // Pass the certificate ID
        headers: {
          Authorization: `${token}`,
        },
      });
  
      if (response.status === 200 && response.data.success) {
        // Remove the deleted certificate from the list
        setCertificatesList(certificatesList.filter((cert) => cert.certificateID !== certificateToDelete.certificateID));
        alert("Certificate deleted successfully!");
      } else {
        alert(response.data.message || "Failed to delete certificate.");
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      alert("An error occurred while deleting the certificate.");
    }
  };
  

  const handleUpdateCertificate = async (updatedCertificateName, updatedOrganization) => {
    if (!currentCertificate) return;

    // Get token from localStorage
    const token = localStorage.getItem("token");

    try {
      // Send update request to the backend
      const response = await axios.put(
        `${BACKEND_URL}/certificate/update_certificate`, // Replace with your server endpoint
        {
          certificateID: currentCertificate.certificateID, // Use the current certificate's ID
          certificateName: updatedCertificateName,
          certificateOrgnization: updatedOrganization,
        },
        {
          headers: {
            Authorization: `${token}`, // Pass the token in the request headers
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        // Update the certificate in the state
        const updatedCertificatesList = certificatesList.map((cert) =>
          cert.certificateID === currentCertificate.certificateID
            ? { ...cert, certificateName: updatedCertificateName, certificateOrgnization: updatedOrganization }
            : cert
        );

        setCertificatesList(updatedCertificatesList);
        alert("Certificate updated successfully!");
      } else {
        alert(response.data.message || "Failed to update the certificate.");
      }
    } catch (error) {
      console.error("Error updating certificate:", error);
      alert("An error occurred while updating the certificate.");
    }
  };


  if (isLoading) return <Loader />;

  return (
    <div className="p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Add Your Certificates</h1>

      {/* Form to add certificate */}
      <form onSubmit={handleAddCertificate} className="mb-6">
        <div className="mb-4">
          <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="certificateName">
            Certificate Name:
          </label>
          <input
            type="text"
            id="certificateName"
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter certificate name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="organization">
            Organization:
          </label>
          <input
            type="text"
            id="organization"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter organization"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Certificate
        </button>
      </form>

      {/* Display previous certificates */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-700">Your Skills</h2>
        {certificatesList.length > 0 ? (
          <ul className="list-disc list-inside ml-4">
            {certificatesList.map((item, index) => (
              <li key={item.SkillID} className="flex justify-between items-center text-gray-700 mb-2">
                <span>
                 Certificate : {item.certificateName} - Orgnization : {item.certificateOrgnization}
                </span>
                <div>
                  <button
                    onClick={() => handleOpenModal(index)}
                    className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDeleteCertificate(index)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No Certificate added yet.</p>
        )}
      </div>

      {currentCertificate && (
        <CertificateModal
          skill={currentCertificate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdateCertificate}
        />
      )}
    </div>
  );
};

const CertificateModal = ({ skill, isOpen, onClose, onSave }) => {
  const [newSkill, setNewSkill] = useState(skill.certificateName);
  const [newLevel, setNewLevel] = useState(skill.certificateOrgnization);

  const handleSave = () => {
    onSave(newSkill, newLevel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed w-screen inset-0 z-50 bg-[#000000aa] grid items-center justify-center">
      <div className="bg-white p-6 opacity-100 rounded-lg shadow-lg w-full max-w-md z-50 relative">
        <h3 className="text-xl font-bold mb-4">Update Certificate</h3>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skill">
            Certificate:
          </label>
          <input
            type="text"
            id="skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
            Orgnization:
          </label>
          <input
            type="text"
            id="level"
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            min="1"
            max="10"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="ml-4 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certification;
