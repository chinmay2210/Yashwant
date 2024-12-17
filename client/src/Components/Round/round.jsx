import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom'
import { BACKEND_URL } from '../../constant.js';
import { useLocation } from "react-router-dom";
import Loader from '../../loader/loader'; 
import "./round.css"

const RoundTable = () => {
    const token = localStorage.getItem("token")
    const location = useLocation();
    const navigate = useNavigate();
    const campusID = location.state?.campusID;
    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(false); // State to manage loading

    useEffect(() => {
        fetchRounds();
    }, []);

    const fetchRounds = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`${BACKEND_URL}/campus/round/${campusID}`,{
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            setRounds(response.data.data);
        } catch (error) {
            console.error('Error fetching rounds:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleUpdateClick = (round) => {
        navigate(`/admin/update_round`, { state: { round } });
    };

    const handleRoundClick = (campusID) => {
        navigate(`/admin/round`, { state: { campusID } });
    };

   
 
        return (
            <>
             
                <div className="tl" id="vc">
                    {loading ? (
                        <Loader /> // Display loader while loading
                    ) : (
                        <table className='ctble'>
                            <caption className='caption'>   <div ><Link  className='tv' to={`/admin/add_round/${campusID}`}>Add new Round <div className='tk'> click here</div></Link></div></caption>
                            <thead>
                                <tr>
                                    <th>Round ID</th>
                                    <th>Round Name</th>
                                    <th>Round Date</th>
                                    <th>Attendace</th>
                                    <th>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rounds.map((round) => (
                                    <tr key={round.RoundID}>
                                        <td>{round.RoundID}</td>
                                        <td>{round.RoundName}</td>
                                        <td>{new Date(round.RoundDate).toLocaleDateString()}</td>
                                        <td><Link to={`/admin/round_attendance/${round.RoundID}`}>click here</Link></td>
                                        <td> <button onClick={() => handleUpdateClick(round)}>Update</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                </div>
            </>
        );

  
};

export default RoundTable;
