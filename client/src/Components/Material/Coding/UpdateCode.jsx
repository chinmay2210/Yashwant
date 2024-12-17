import React, { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../constant';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../../loader/loader';

function UpdateCodingQuestion() {
    const token = localStorage.getItem("token");
    const location = useLocation();
    const navigate = useNavigate();
    const { codingQuestion } = location.state || {};

    const [formData, setFormData] = useState({
        Question: codingQuestion.Question,
        SampleInput: codingQuestion.SampleInput,
        SampleOutput: codingQuestion.SampleOutput,
        Explanation: codingQuestion.Explanation,
        Code: codingQuestion.Code
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            await axios.put(`${BACKEND_URL}/pyq/update_question/${codingQuestion.CodeID}`, formData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            setSuccessMessage('Coding question updated successfully.');
            navigate(`/admin/view_coding_question`, { state: { campusId: codingQuestion.CampusID, campusName: codingQuestion.CampusName } });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred while updating the coding question.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <div className="center">
                {loading ? (
                    <Loader />
                ) : (
                    <form className="form" onSubmit={handleSubmit}>
                        <p className="title">Update Coding Question</p>
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="Question"
                                value={formData.Question}
                                onChange={handleChange}
                                required
                            />
                            <span>Question</span>
                        </label>
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="SampleInput"
                                value={formData.SampleInput}
                                onChange={handleChange}
                                required
                            />
                            <span>Sample Input</span>
                        </label>
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="SampleOutput"
                                value={formData.SampleOutput}
                                onChange={handleChange}
                                required
                            />
                            <span>Sample Output</span>
                        </label>
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="Explanation"
                                value={formData.Explanation}
                                onChange={handleChange}
                                required
                            />
                            <span>Explanation</span>
                        </label>
                        <label>
                            <textarea
                                className="input"
                                name="Code"
                                value={formData.Code}
                                onChange={handleChange}
                                required
                            />
                            <span>Code</span>
                        </label>
                        <button className="submit">Update</button>
                        {error && <div className="error-message">{error}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}
                    </form>
                )}
            </div>
           
        </>
    );
}

export default UpdateCodingQuestion;
