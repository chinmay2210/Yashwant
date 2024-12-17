import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TableSection from '../Table';
import axios from 'axios';
import { BACKEND_URL } from "../../../constant";

const AllCampusOverview = () => {
    const [placementData, setPlacementData] = useState([]);

    // Function to fetch completed campus data from the server
    const fetchCompletedCampusData = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(BACKEND_URL + '/stats/complateCampus',{
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            setPlacementData(response.data);
        } catch (error) {
            console.error("Error fetching completed campus data:", error);
        }
    };

    useEffect(() => {
        fetchCompletedCampusData();
    }, []);

    // Map the placementData to include a link for the Stats column
    const formattedData = placementData.map(item => ({
        ...item,
        stats: <Link to={`/admin/campus_stats/${item.campusId}`} className="text-blue-600 underline">View</Link> // Correctly create the link
    }));

    return (
        <div className="bg-gray-100">
            <div className="p-4 w-[95%] mx-auto ">
                <Link to="/admin" className="px-3 bg-green-700 text-white rounded-lg">Go Back</Link>
                <h1 className="text-2xl font-bold my-6">Campus Overview</h1>
                <TableSection
                    title="Placement Drive Statistics"
                    headers={[
						"Campus ID",
                        "Name",
                        "Dates",
                        "Eligible Students",
                        "Placed Students",
                        "Pending",
                        "Stats" // Ensure this header matches the new data structure
                    ]}
                    data={formattedData} // Use the formatted data
                    expandedData={formattedData} // If you have any expanded data
                />
            </div>
        </div>
    );
};

export default AllCampusOverview;
