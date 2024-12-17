import axios from 'axios';
import React, { useEffect, useState } from "react";
import Loader from "../../../loader/loader";
import Coding from "./PYQ/Coding";
import Aptitude from "./PYQ/Aptitude";
import Questions from "./PYQ/Questions";
import { BACKEND_URL } from '../../../constant';

const Campus = () => {
    const [campusData, setCampusData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [selectedCampusId, setSelectedCampusId] = useState(null);

    const getData = (id, item) => {
        setSelectedCampusId(id);
        switch (item.toLowerCase()) {
            case "coding":
                setSelectedComponent("coding");
                break;
            case "aptitude and lr":
                setSelectedComponent("aptitude");
                break;
            case "interview questions":
                setSelectedComponent("questions");
                break;
            default:
                setSelectedComponent(null);
        }
    };

    useEffect(() => {
        const fetchCampusData = async () => {
            setIsLoading(true);
            
            // Retrieve the student data and token from localStorage
            const studentData = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            if (studentData && token) {
                try {
                    const response = await axios.get(
                        `${BACKEND_URL}/student/get_campus/${studentData.id}`,
                        {
                            headers: {
                                'Authorization': token,
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                   if(response.status === 200){
                    console.log(response.data['campus'])
                    setCampusData(response.data['campus'].reverse())
                   }
                } catch (error) {
                    console.error("Error fetching campus data:", error);
                }
            } else {
                console.error("Student data or token not found in localStorage.");
            }

            setIsLoading(false);
        };

        fetchCampusData();
    }, []);

    const renderSelectedComponent = () => {
        switch (selectedComponent) {
            case "coding":
                return <Coding campusId={selectedCampusId} />;
            case "aptitude":
                return <Aptitude campusId={selectedCampusId} />;
            case "questions":
                return <Questions campusId={selectedCampusId} />;
            default:
                return null;
        }
    };

    if (isLoading) return <Loader />;

    if (selectedComponent) {
        return (
            <div className="p-8 bg-white shadow-md rounded-lg">
                <button
                    onClick={() => setSelectedComponent(null)}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Campus List
                </button>
                {renderSelectedComponent()}
            </div>
        );
    }

    return (
        <div className="p-8 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">
                Campus Recruitment
            </h1>
            {campusData.map((campus) => (
                <div
                    key={campus.CampusID}
                    className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm"
                >
                    <h2 className="text-xl font-semibold text-blue-500">
                        {campus.CampusName}
                    </h2>
                    <p className="mt-2 text-gray-700">{campus.Message}</p>
                    <p className="mt-2 text-gray-500">Date: {new Date(campus.Date).toLocaleDateString()}</p>
                    <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-700">Rounds:</h3>
                        <ul className="list-disc list-inside ml-4">
                            {campus.Rounds.map((round, index) => (
                                <li key={index} className="text-gray-600">
                                    {round.RoundName} - {new Date(round.RoundDate).toLocaleDateString()} (Attendance: {round.AttendanceStatus})
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4">
    <h3 className="text-lg font-medium text-gray-700">
        Quick Lessons:
    </h3>
    <ul className="grid py-3 grid-cols-3 gap-5 ml-4">
        {/* Hardcoded items representing different lessons */}
        <li
            onClick={() => {
                getData(campus.CampusID, 'Coding');
            }}
            className="bg-red-700 rounded-lg text-center text-white p-2 cursor-pointer hover:bg-red-800"
        >
            Coding
        </li>
        <li
            onClick={() => {
                getData(campus.CampusID, 'Aptitude and LR');
            }}
            className="bg-red-700 rounded-lg text-center text-white p-2 cursor-pointer hover:bg-red-800"
        >
            Aptitude and LR
        </li>
        <li
            onClick={() => {
                getData(campus.CampusID, 'Interview Questions');
            }}
            className="bg-red-700 rounded-lg text-center text-white p-2 cursor-pointer hover:bg-red-800"
        >
            Interview Questions
        </li>
    </ul>
</div>

                </div>
            ))}
        </div>
    );
};

export default Campus;
