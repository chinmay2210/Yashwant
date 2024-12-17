import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../../loader/loader';
import { BACKEND_URL } from '../../../constant';

function ViewInterviewQuestions() {
    const token = localStorage.getItem("token");
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { campusId, campusName } = location.state || {};

    useEffect(() => {
        if (!campusId) {
            setError('Campus ID is required to fetch interview questions.');
            setLoading(false);
            return;
        }
    
        const fetchInterviewQuestions = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/pyq/interview`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    params: { campusID: campusId } // Passing campusId as query parameter
                });
    
                if (Array.isArray(response.data.data)) {
                    setInterviewQuestions(response.data.data);
                } else {
                    setError('Data format error: Expected an array');
                }
            } catch (error) {
                setError(error.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };
    
        fetchInterviewQuestions();
    }, [campusId]);
    

    const handleUpdateClick = (question) => {
        navigate(`/admin/update_interview_question`, { state: { question } });
    };

    const handleDeleteClick = async (codeID) => {
        try {
            await axios.delete(`${BACKEND_URL}/pyq/delete_interview_question/${codeID}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            setInterviewQuestions(interviewQuestions.filter(q => q.CodeID !== codeID));
        } catch (error) {
            console.error('Error deleting interview question:', error.message);
        }
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
                    <h2>{campusName ? `Interview Questions for ${campusName}` : 'Interview Questions'}</h2>
                    <table className="ctble">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Question</th>
                                <th>Answer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interviewQuestions.map((question, index) => (
                                <tr key={question.CodeID}>
                                    <td>{index + 1}</td>
                                    <td>{question.Question.slice(0, 10)}...</td>
                                    <td>{question.Answer.slice(0, 10)}...</td>
                                    <td>
                                        <button onClick={() => handleUpdateClick(question)}>Update</button>
                                        <button onClick={() => handleDeleteClick(question.CodeID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            
            </>
        );

}

export default ViewInterviewQuestions;
