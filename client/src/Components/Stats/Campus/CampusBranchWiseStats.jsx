import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../../constant";
import TableSection from '../Table';

const CampusBranchWiseStats = () => {
    const { campusId } = useParams(); // Get campusId from URL params
    const [placementData, setPlacementData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBranchWisePlacement = async () => {
            try {
                const token = localStorage.getItem("token"); // If your API requires authentication
                const response = await axios.get(`${BACKEND_URL}/stats/branch_wise_placement/${campusId}`, {
                    headers: {
                        'Authorization': `${token}`, // Adjust based on your auth mechanism
                        'Content-Type': 'application/json',
                    },
                });
                setPlacementData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching branch-wise placement data:", err);
                setError("Failed to fetch branch-wise placement data.");
                setLoading(false);
            }
        };

        fetchBranchWisePlacement();
    }, [campusId]);

    const downloadBranchWisePlacements = async (branchName) => {
        try {
            
            const response = await axios.get(`${BACKEND_URL}/stats/campus_branch_wise_download/${branchName}/${campusId}`, {
                responseType: 'blob', // Important to specify the response type
            });

            // Create a URL for the downloaded file and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'placed_students.xlsx'); // File name to download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    // Prepare data for TableSection
    const tableData = placementData.map(item => ({
        Branch: item.Branch,
        'Total Students': item['Total Students'],
        'Placed Students': item['Placed Students'],
        'Pending': item['Pending'],
        'Download': (
            <button 
                onClick={() => downloadBranchWisePlacements(item.Branch)} 
                className="text-blue-500 hover:underline"
            >
                Download
            </button>
        ),
    }));

    const headers = ["Branch", "Total Students", "Placed Students", "Pending", "Download"];

    if (loading) {
        return (
            <div className="bg-gray-100">
                <div className="p-4 w-[95%] mx-auto min-h-screen flex justify-center items-center">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-100">
                <div className="p-4 w-[95%] mx-auto min-h-screen flex justify-center items-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100">
            <div className="p-4 w-[95%] mx-auto min-h-screen">
                <h1 className="text-2xl font-bold my-6">Branch Wise Placement for Campus ID: {campusId}</h1>
                <TableSection
                    title="Branch Wise Placement Statistics"
                    headers={headers}
                    data={tableData}
                    expandedData={tableData} // Assuming expandedData is used similarly
                />
            </div>
        </div>
    );
};

export default CampusBranchWiseStats;
