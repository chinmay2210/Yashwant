import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../loader/loader'; 
import { BACKEND_URL } from '../../constant';

function CampusMaterial() {
    const [campuses, setCampuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/campus/read`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });

                // Log the response data to verify its structure
                console.log('API response:', response.data);
                
                // Check if the response data itself is an array
                if (Array.isArray(response.data)) {
                    setCampuses(response.data.reverse());
                } else {
                    setError('Data format error: Expected an array');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchCampuses();
    }, [token]);

    const onSubmit = async (campusid,campusname,pyq) => {
        setLoading(true); // Start loading
        try {
            const res = await axios.post(`${BACKEND_URL}/notification/send_notification`, {
                campusId: campusid,
                pyq:pyq,
                campusname:campusname
            }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                setSuccessMessage('Notification sent successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to send notification');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || 'An error occurred');
            setSuccessMessage('');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleAddCodingQuestion = (campus) => {
        navigate(`/admin/add_coding_question`, { state: { campusId: campus.campusID, campusName: campus.campusName } });
    };

    const handleVeiwCodingQuestion = (campus) => {
        navigate(`/admin/view_coding_question`, { state: { campusId: campus.campusID, campusName: campus.campusName } });
    };

    const handlePyqCodingQuestion = (campus,pyq) => {
        navigate(`/admin/view_pyq_stats`, { state: { campusId: campus.campusID, campusName: campus.campusName ,pyq:pyq} });
    };

    const handleAddAptiLRQuestion = (campus) => {
        navigate(`/admin/add_apti_lr_question`, { state: { campusId: campus.campusID, campusName: campus.campusName } });
    };

    const handleAptiAptiLRQuestion = (campus) => {
        navigate(`/admin/view_apti_lr_question`, { state: { campusId: campus.campusID, campusName: campus.campusName } });
    };

    const handleAddInterviewQuestion = (campus) => {
        navigate(`/admin/add_interview_question`, { state: { campusId: campus.campusID, campusName: campus.campusName } });
    };

    const handleVeiwInterviewQuestion = (campus) => {
        navigate(`/admin/view_interview_question`, { state: { campusId: campus.campusID, campusName: campus.campusName } });
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

        return (
            <>
                <div className="tl" id="vc">
                    {successMessage && (
                        <div className="popup success-popup">
                            <span className="close-btn" onClick={() => setSuccessMessage('')}>&times;</span>
                            <div className="popup-message">{successMessage}</div>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="popup error-popup">
                            <span className="close-btn" onClick={() => setErrorMessage('')}>&times;</span>
                            <div className="popup-message">{errorMessage}</div>
                        </div>
                    )}
                    <table className="ctble">
                        <thead>
                            <tr>
                                <th>Campus Name</th>
                                <th>Codeing Questions</th>
                                <th>Apti/LR Questions</th>
                                <th>Interview Questions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campuses.map((campus) => (
                                <tr key={campus.campusID}>
                                    <td>{campus.campusName}</td>
                                    <td>
                                        <button onClick={() => handleAddCodingQuestion(campus)}>Add Coding Question</button>
                                        <br></br>
                                        <button onClick={() => handleVeiwCodingQuestion(campus)}>Veiw Coding Question</button>
                                        <br></br>
                                        <button onClick={() => handlePyqCodingQuestion(campus,'Coding')}>Veiw Stats</button>
                                        <br></br>
                                        <button onClick={() => onSubmit(campus.campusID,campus.campusName,'coding')}>Send Notification</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleAddAptiLRQuestion(campus)}>Add Apti/LR Question</button>
                                        <br></br>
                                        <button onClick={() => handleAptiAptiLRQuestion(campus)}>Veiw Apti/LR Question</button>
                                        <br></br>
                                        <button onClick={() => handlePyqCodingQuestion(campus,'AptiLR')}>Veiw Stats</button>
                                        <br></br>
                                        <button onClick={() => onSubmit(campus.campusID,campus.campusName,'aptilr')}>Send Notification</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleAddInterviewQuestion(campus)}>Add Interview Question</button>
                                        <br></br>
                                        <button onClick={() => handleVeiwInterviewQuestion(campus)}>VeiwInterview Question</button>
                                        <br></br>
                                        <button onClick={() => handlePyqCodingQuestion(campus,'Interview')}>Veiw Stats</button>
                                        <br></br>
                                        <button onClick={() => onSubmit(campus.campusID,campus.campusName,'interview')}>Send Notification</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              
            </>
        );
}

export default CampusMaterial;
