import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useForm } from 'react-hook-form'; // Don't forget to import useForm if it's not already imported
import Loader from '../../loader/loader'; 

function UpdateSubAdmin() {
    const token = localStorage.getItem("token")
    const { state: { SubAdmin } } = useLocation(); // Use useLocation to access props passed via navigation
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading
    const navigate = useNavigate();

    useEffect(() => {
        if (SubAdmin) {
            setValue('username', SubAdmin.name);
            setValue('id', SubAdmin.id);
            setValue('password', SubAdmin.password);
            setValue('cpassword', SubAdmin.password);
        }
    }, [SubAdmin, setValue]);

    const onSubmit = async (data) => {
        if (data.password !== data.cpassword) {
            setErrorMessage("Confirm password does not match with password");
            setSuccessMessage('');
            return;
        }

        setLoading(true); // Start loading
        try {
            const res = await axios.put(`${BACKEND_URL}/subadmin/update`, {
                sID:SubAdmin.sID,
                newId: data.id,
                name: data.username,
                password: data.password
            },{
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 409) {
                setErrorMessage("SubAdmin already exists");
                setSuccessMessage('');
            } else if (res.status === 200) {
                setSuccessMessage("SubAdmin updated successfully");
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
                    <p className="title">Update SubAdmin</p>
                    <p className="message">Update the SubAdmin's details</p>
                    <div className="flex">
                        <label>
                            <input className="input" type="text" placeholder="" {...register('username', { required: true })} required />
                            <span>Name</span>
                        </label>
                    </div>
                    <label>
                        <input className="input" type="text" placeholder="" {...register('id', { required: true })} required />
                        <span>ID</span>
                    </label>
                    <label>
                        <input className="input" type="password" placeholder="" {...register('password')} required/>
                        <span>Password</span>
                    </label>
                    <label>
                        <input className="input" type="password" placeholder="" {...register('cpassword')} required/>
                        <span>Confirm password</span>
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

export default UpdateSubAdmin;
