import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../constant';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../../loader/loader';

function ViewAptiLRQuestions() {
    const token = localStorage.getItem("token");
    const [aptiLRQuestions, setAptiLRQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { campusId, campusName } = location.state || {};

    useEffect(() => {
        if (!campusId) {
            setError('Campus ID is required to fetch Apti/Logical Reasoning questions.');
            setLoading(false);
            return;
        }

        const fetchAptiLRQuestions = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/pyq/apti?campusId=${campusId}`, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
                if (Array.isArray(response.data.aptiLRQuestions)) {
                    setAptiLRQuestions(response.data.aptiLRQuestions);
                } else {
                    setError('Data format error: Expected an array');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchAptiLRQuestions();
    }, [campusId]);

    const handleUpdateClick = (aptiLRQuestion) => {
        console.log(aptiLRQuestion)
        navigate(`/admin/update_apti_lr_question`, { state: { aptiLRQuestion } });
    };

    const handleDeleteClick = async (aptiLRID) => {
        try {
            await axios.delete(`${BACKEND_URL}/pyq/delete_apit_question/${aptiLRID}`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            setAptiLRQuestions(aptiLRQuestions.filter(q => q.AptiLRID !== aptiLRID));
        } catch (error) {
            console.error('Error deleting Apti/Logical Reasoning question:', error.message);
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
                    <h2>{campusName ? `Apti/Logical Reasoning Questions for ${campusName}` : 'Apti/Logical Reasoning Questions'}</h2>
                    <table className="ctble">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Question</th>
                                <th>Option 1</th>
                                <th>Option 2</th>
                                <th>Option 3</th>
                                <th>Option 4</th>
                                <th>Explanation</th>
                                <th>Answer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aptiLRQuestions.map((question, index) => (
                                <tr key={question.AptiLRID}>
                                    <td>{index + 1}</td>
                                    <td>{question.Question.slice(0, 10)}...</td>
                                    <td>{question.Option1.slice(0, 10)}...</td>
                                    <td>{question.Option2.slice(0, 10)}...</td>
                                    <td>{question.Option3.slice(0, 10)}...</td>
                                    <td>{question.Option4.slice(0, 10)}...</td>
                                    <td>{question.Explanation.slice(0, 10)}...</td>
                                    <td>{question.Answer.slice(0, 10)}...</td>
                                    <td>
                                        <button onClick={() => handleUpdateClick(question)}>Update</button>
                                        <button onClick={() => handleDeleteClick(question.AptiLRID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
}

export default ViewAptiLRQuestions;
