import "./home.css";
import React, { useState, useEffect } from "react";
import CampusCard from "../Campus/campus_card";
import CampusTable from "../Campus/campus_table";
import Loader from '../../loader/loader'; 
import axios from 'axios';
import { BACKEND_URL } from "../../constant";

function Home() {
    const [campuses, setCampuses] = useState([]);
    const [loading, setLoading] = useState(false); // State to manage loading
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCampuses = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get(BACKEND_URL + "/campus/read", {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
    
                // Check if the response status is 404 (Not Found)
                if (response.status === 404) {
                   
                    setCampuses([]); // Set an empty array or handle as needed
                } else {
                    // Reverse the campuses array to show the most recent campuses first
                    setCampuses(response.data.reverse());
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    
                    setCampuses([]); // Set an empty array or handle as needed
                } else {
                    
                }
            } finally {
                setLoading(false); // Stop loading
            }
        };
    
        fetchCampuses();
    }, []);
    

    const latestCampuses = campuses.slice(0, 4);
    const pastCampuses = campuses.slice(4);

    return (
            <>
              
                <br />
                {loading ? (
                    <Loader /> // Display loader while loading
                ) : (
                    <>
                        <div className="section">
                            <div className="campushead">
                                <h3>Ongoing Campus</h3>
                            </div>
                            <div className="home">
                                <div className="homecard">
                                    {latestCampuses.map(campus => (
                                        <CampusCard key={campus.campusID} campus={campus} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="section">
                            <div className="campushead">
                                <h3>Past Campus</h3>
                            </div>
                            <div className="tl">
                                <CampusTable campuses={pastCampuses} />
                            </div>
                        </div>
                    </>
                )}
               
            </>
        
    );
}

export default Home;
