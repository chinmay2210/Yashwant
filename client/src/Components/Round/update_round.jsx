import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../constant";
import { useForm } from "react-hook-form";
import Loader from "../../loader/loader";  

function UpdateRound() {
    const token = localStorage.getItem("token")
    const { state: { round } } = useLocation();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);  // State to manage loading

    useEffect(() => {
        if (round) {
            const isoDate = new Date(round.RoundDate).toISOString().split('T')[0];
            setValue('roundName', round.RoundName);
            setValue('roundDate', isoDate);
        }
    }, [round, setValue]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onSubmit = async (data) => {
        setLoading(true);  // Start loading
        const formData = new FormData();
        formData.append("roundID", round.RoundID);
        formData.append("roundName", data.roundName);
        formData.append("roundDate", data.roundDate);
        if (file) {
            formData.append("file", file);
        }

        try {
            const response = await axios.put(`${BACKEND_URL}/campus/update_round`, formData, {
                headers: {
                    'Authorization': token,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                setErrorMessage('');
            } else {
                setErrorMessage(response.data.message || 'Unexpected error occurred');
                setSuccessMessage('');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Something went wrong");
                setSuccessMessage('');
            } else if (error.request) {
                setErrorMessage("No response from server. Please try again later.");
                setSuccessMessage('');
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
                setSuccessMessage('');
            }
        } finally {
            setLoading(false);  // Stop loading
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
                    <form className="form" onSubmit={handleSubmit(onSubmit)}>
                        <p className="title">Round</p>
                        <p className="message">Update round details in form.</p>
    
                        <label>
                            <input
                                className="input"
                                type="text"
                                name="roundName"
                                placeholder=""
                                {...register('roundName', { required: true })}
                            />
                            <span>Round Name</span>
                            {errors.roundName && <span className="error-message">Round Name is required</span>}
                        </label>
                        <label>
                            <input
                                className="input"
                                type="date"
                                name="roundDate"
                                placeholder=""
                                {...register('roundDate', { required: true })}
                            />
                            <span>Date</span>
                            {errors.roundDate && <span className="error-message">Date is required</span>}
                        </label>
                        <label>
                            <input
                                className="input"
                                type="file"
                                name="file"
                                placeholder=""
                                onChange={handleFileChange}
                            />
                            <span>XLS File</span>
                        </label>
                        <button className="submit">Submit</button>
                    </form>
                    {loading && <Loader />}  // Display loader when loading
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

export default UpdateRound;
