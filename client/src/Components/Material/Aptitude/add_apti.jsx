import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../../../loader/loader';
import { BACKEND_URL } from '../../../constant';

function AddAptiLRQuestion() {
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
            const res = await axios.post(`${BACKEND_URL}/pyq/add_apit_question`, {
                ...data,
                CampusID: campusId
            }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 201) {
                setSuccessMessage('Apti/Logical Reasoning question added successfully');
                setErrorMessage('');
            } else {
                setErrorMessage('Failed to add question');
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
                        <p className="title">Add Apti/Logical Reasoning Question</p>
                        <div className="flex">
                            <label>
                                <input className="input" type="text" placeholder="" {...register('Question', { required: true })} />
                                <span>Question</span>
                            </label>
                        </div>
                        <label>
                            <input className="input" type="text" placeholder="" {...register('Option1')} />
                            <span>Option 1</span>
                        </label>
                        <label>
                            <input className="input" type="text" placeholder="" {...register('Option2')} />
                            <span>Option 2</span>
                        </label>
                        <label>
                            <input className="input" type="text" placeholder="" {...register('Option3')} />
                            <span>Option 3</span>
                        </label>
                        <label>
                            <input className="input" type="text" placeholder="" {...register('Option4')} />
                            <span>Option 4</span>
                        </label>
                        <label>
                            <textarea className="input" placeholder="" {...register('Explanation')} />
                            <span>Explanation</span>
                        </label>
                        <label>
                            <input className="input" type="text" placeholder="" {...register('Answer', { required: true })} />
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

export default AddAptiLRQuestion;
