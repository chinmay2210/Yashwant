import React, { useState } from 'react';
import '../LoginForm.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../../constant';

const NewPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    

    const validatePassword = (password) => {
        const lengthCheck = password.length >= 8;
        const uppercaseCheck = /[A-Z].*[A-Z]/.test(password);
        const numberCheck = /\d/.test(password);
        const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!lengthCheck) return "Password must be at least 8 characters long.";
        if (!uppercaseCheck) return "Password must contain at least 2 uppercase letters.";
        if (!numberCheck) return "Password must contain at least 1 numerical digit.";
        if (!specialCharCheck) return "Password must contain at least 1 special symbol.";

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validatePassword(password);

        if (validationError) {
            setError(validationError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("user"))
            const response = await axios.post(`${BACKEND_URL}/auth/student_update_password`, {
                email: user['College MailID'],
                password: password,
            });

            if (response.data.token) {
                // Handle successful password update
                localStorage.setItem('token', response.data.token); // Store the new token
                navigate('/'); // Redirect to student dashboard or another page
            } else {
                setError(response.data.message || 'An error occurred while updating the password.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setError('An error occurred while updating the password. Please try again later.');
        }
    };

    return (
        <div className='box'>
            <div className='nest'>
                <div className='form-box'>
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Create New Password</h2>
                        {error && <p className="error-message">{error}</p>}
                        <div className="form-group">
                            <label htmlFor="password">Enter New Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder='New Password'
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm New Password:</label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder='Confirm Password'
                            />
                        </div>
                        <button type="submit" className="login-button">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewPasswordForm;
