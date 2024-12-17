import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../constant';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../../loader/loader';

function ViewCodingQuestions() {
    const token = localStorage.getItem("token");
    const [codingQuestions, setCodingQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

  
    const { campusId, campusName } = location.state || {};

    useEffect(() => {
        if (!campusId) {
            setError('Campus ID is required to fetch coding questions.');
            setLoading(false);
            return;
        }

        const fetchCodingQuestions = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/pyq/code?campusId=${campusId}`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
                if (Array.isArray(response.data.codingQuestions)) {
                    setCodingQuestions(response.data.codingQuestions);
                } else {
                    setError('Data format error: Expected an array');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchCodingQuestions();
    }, [campusId]);

    const handleUpdateClick = (codingQuestion) => {
        navigate(`/admin/update_coding_question`, { state: { codingQuestion } });
    };

    const handleDeleteClick = async (codeID) => {
        try {
            await axios.delete(`${BACKEND_URL}/pyq/delete_question/${codeID}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            setCodingQuestions(codingQuestions.filter(q => q.CodeID !== codeID));
        } catch (error) {
            console.error('Error deleting coding question:', error.message);
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
                    <h2>{campusName ? `Coding Questions for ${campusName}` : 'Coding Questions'}</h2>
                    <table className="ctble">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Question</th>
                                <th>Sample Input</th>
                                <th>Sample Output</th>
                                <th>Explanation</th>
                                <th>Code</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {codingQuestions.map((question, index) => (
                                <tr key={question.codeID}>
                                    <td>{index + 1}</td>
                                    <td>{question.Question.slice(0, 10)}...</td>
                                    <td>{question.SampleInput.slice(0, 10)}...</td>
                                    <td>{question.SampleOutput.slice(0, 10)}...</td>
                                    <td>{question.Explanation.slice(0, 10)}...</td>
                                    <td>{question.Code.slice(0, 10)}...</td>
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

export default ViewCodingQuestions;
