import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../../../loader/loader';
import { BACKEND_URL } from '../../../constant';

function AddInterviewQuestion() {
    const { state } = useLocation();
    const campusId = state?.campusId;
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const onSubmit = async (data) => {
        if (!campusId) {
            setErrorMessage('Campus ID is missing.');
            setSuccessMessage('');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${BACKEND_URL}/pyq/add_interview_question`, {
                ...data,
                campusID: campusId
            }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 201) {
                setSuccessMessage('Interview question added successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to add interview question');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || 'An error occurred');
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setErrorMessage('');
    };

    const handleCloseSuccess = () => {
        setSuccessMessage('');
    };


    return (
        <>
          
            <div className="center vs1">
                {loading ? (
                    <Loader />
                ) : (
                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <p className="title">Add Interview Question</p>
                        <div className="flex">
                            <label>
                                <input className="input" type="text" placeholder="" {...register('question', { required: true })} />
                                <span>Question</span>
                            </label>
                        </div>
                        <label>
                            <textarea className="input" placeholder="" {...register('answer', { required: true })} />
                            <span>Answer</span>
                        </label>
                        <button className="submit">Submit</button>
                    </form>
                )}
                {errorMessage && (
                    <div className="popup error-popup">
                        <span className="close-btn" onClick={handleCloseError}>&times;</span>
                        <div className="popup-message">{errorMessage}</div>
                    </div>
                )}
                {successMessage && (
                    <div className="popup success-popup">
                        <span className="close-btn" onClick={handleCloseSuccess}>&times;</span>
                        <div className="popup-message">{successMessage}</div>
                    </div>
                )}
            </div>
         
        </>
    );
}

export default AddInterviewQuestion;
