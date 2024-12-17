import React, { useState, useEffect } from "react";
import Loader from "../../../../loader/loader";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the profile data from localStorage
    const storedProfile = localStorage.getItem("user");

    if (storedProfile) {
      // Parse the JSON string back to an object
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
    }

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) return <Loader />;

  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="bg-white shadow-md rounded-lg">

      <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-blue-500">{profile["Name of Student"]}</h2>
        <p className="mt-2 text-gray-700">
          <strong>Branch:</strong> {profile["Branch"]}
        </p>
        <p className="mt-2 text-gray-700">
          <strong>Section:</strong> {profile["Section"]}
        </p>
        <p className="mt-2 text-gray-700">
          <strong>College ID:</strong> {profile["College ID"]}
        </p>
        <p className="mt-2 text-gray-700">
          <strong>Gender:</strong> {profile["Gender"]}
        </p>
        <p className="mt-2 text-gray-700">
          <strong>Date of Birth:</strong> {profile["DoB"]}
        </p>
        <p className="mt-2 text-gray-700">
          <strong>Mobile 1:</strong> {profile["Mobile 1"]}
        </p>
        <p className="mt-2 text-gray-700">
          <strong>Personal Email:</strong> {profile["Personal Email Address"]}
        </p>
        <p className="mt-2 text-gray-700">
          <strong>College Email:</strong> {profile["College MailID"]}
        </p>
      </div>
  
    </div>
  );
};

export default Profile;
