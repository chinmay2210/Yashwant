import axios from 'axios';
import { BACKEND_URL } from '../../constant';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Loader from '../../loader/loader'; 

function SubAdmin() {
    const token = localStorage.getItem("token")
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading

    const onSubmit = async (data) => {
        if (data.password !== data.cpassword) {
            setErrorMessage("Confirm password does not match with password");
            setSuccessMessage('');
            return;
        }

        setLoading(true); // Start loading
        try {
            const res = await axios.post(`${BACKEND_URL}/subadmin/create`, {
                id: data.id,
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
            } else if (res.status === 201) {
                setSuccessMessage("SubAdmin created successfully");
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
                            <p className="title">SubAdmin</p>
                            <p className="message">Fill form to give access to TPC App</p>
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
                                <input className="input" type="password" placeholder="" {...register('password', { required: true })} required />
                                <span>Password</span>
                            </label>
                            <label>
                                <input className="input" type="password" placeholder="" {...register('cpassword', { required: true })} required />
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

export default SubAdmin;
