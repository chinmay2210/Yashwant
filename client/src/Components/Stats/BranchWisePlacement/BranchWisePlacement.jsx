import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from "../../../constant";

const TableSection = ({ title, data, headers, expandedData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <h3 className="text-lg font-medium p-4 bg-gray-50 border-b">{title}</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {(isExpanded ? expandedData : data).map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const CampusBranchOverview = () => {
    const [placementData, setPlacementData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchBranchWisePlacement = async () => {
            try {
                const token = localStorage.getItem("token"); // If your API requires authentication
                const response = await axios.get(BACKEND_URL + "/stats/branch-wise-placement", {
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
    }, []);

    const downloadBranchWisePlacements = async (branchName) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}/stats/branch_wise_download/${branchName}`, {
                headers: {
                    'Authorization': `${token}`, 
                    'Content-Type': 'application/json',
                },
                responseType: 'blob',
            });
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
    
    const handleClick = (branch) => {
        navigate(`/admin/branch-stats`, { state: { branchName:branch } });
    };
    // Prepare data for TableSection
    const tableData = placementData.map(item => ({
        Branch: item.Branch,
        'Total Students': item['Total Students'],
        'Placed Students': item['Placed Students'],
        'Not Eligible': item['Not Eligible'],
        'Pending': item['Pending'],
        'Download': (
            <button 
                onClick={() => downloadBranchWisePlacements(item.Branch)} 
                className="text-blue-500 hover:underline"
            >
                Download
            </button>
        ),
        "View Stats": (
            <button 
                onClick={() => handleClick(item.Branch)} 
                className="text-blue-500 hover:underline"
            >
                View Stats
            </button>
        )
    }));
    
    

    const headers = ["Branch", "Total Students", "Placed Students","Not Eligible", "Pending", "Download","Stats"];

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
            <div className="p-4 w-[95%] mx-auto ">
                <h1 className="text-2xl font-bold my-6">Branch Wise Placement</h1>
                <TableSection
                    title="Placement Drive Statistics"
                    headers={headers}
                    data={tableData}
                    expandedData={tableData} // Assuming expandedData is used similarly
                />
            </div>
        </div>
    );
};

export default CampusBranchOverview;
