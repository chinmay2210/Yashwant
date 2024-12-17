import axios from 'axios';
import { BACKEND_URL } from '../../constant';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../loader/loader';

function AddRound() {
    const token = localStorage.getItem("token");
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading
    const { campusID } = useParams(); 
    console.log(campusID)// Get campusID from the URL
    const onSubmit = async (data) => {
        setLoading(true); // Start loading
        try {
            console.log(data.date)
            const res = await axios.post(`${BACKEND_URL}/campus/add_round`, {
                campusID: campusID, // Include campusID in the request data
                roundName: data.roundName,
                date: data.date,
            }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 409) {
                setErrorMessage("Round already exists");
                setSuccessMessage('');
            } else if (res.status === 201) {
                setSuccessMessage("Round created successfully");
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || "An error occurred");
            setSuccessMessage('');
        } finally {
            setLoading(false); // Stop loading
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
                        <Loader /> // Display loader while submitting the form
                    ) : (
                        <form className="form" onSubmit={handleSubmit(onSubmit)}>
                            <p className="title">Add Round</p>
                            <p className="message">Fill form to create a new round</p>
                            <label>
                                <input className="input" type="text" placeholder="" {...register('roundName', { required: true })} required />
                                <span>Round Name</span>
                            </label>
                            <label>
                                <input className="input" type="date" placeholder="" {...register('date', { required: true })} required />
                                <span>Date</span>
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

export default AddRound;
