import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../../../loader/loader';
import { BACKEND_URL } from '../../../constant';

function UpdateAptiLRQuestion() {
    const { state } = useLocation();
    const question = state?.aptiLRQuestion;
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Initialize form fields with question data
    useState(() => {
        if (question) {
            const { Question, Option1, Option2, Option3, Option4, Explanation, Answer } = question;
            setValue('question', Question);
            setValue('option1', Option1);
            setValue('option2', Option2);
            setValue('option3', Option3);
            setValue('option4', Option4);
            setValue('explanation', Explanation);
            setValue('answer', Answer);
        } else {
            setErrorMessage('Question data is missing.');
        }
    }, [question]);

    const onSubmit = async (data) => {
        if (!question) {
            setErrorMessage('Question data is missing.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.put(`${BACKEND_URL}/pyq/update_apit_question/${question.AptiLRID}`, data, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200) {
                setSuccessMessage('Question updated successfully');
                setErrorMessage('');
               
            } else {
                setErrorMessage('Failed to update question');
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
                        <p className="title">Update Apti/Logical Reasoning Question</p>
                        <div className="flex">
                            <label>
                                <input className="input" type="text" placeholder="" {...register('question', { required: true })} />
                                <span>Question</span>
                            </label>
                        </div>
                        <label>
                            <textarea className="input" placeholder="" {...register('option1')} />
                            <span>Option 1</span>
                        </label>
                        <label>
                            <textarea className="input" placeholder="" {...register('option2')} />
                            <span>Option 2</span>
                        </label>
                        <label>
                            <textarea className="input" placeholder="" {...register('option3')} />
                            <span>Option 3</span>
                        </label>
                        <label>
                            <textarea className="input" placeholder="" {...register('option4')} />
                            <span>Option 4</span>
                        </label>
                        <label>
                            <textarea className="input" placeholder="" {...register('explanation')} />
                            <span>Explanation</span>
                        </label>
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

export default UpdateAptiLRQuestion;
