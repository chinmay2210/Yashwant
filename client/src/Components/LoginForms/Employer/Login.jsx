import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../../constant';

const EmployerLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const role = localStorage.getItem("role");
            if (role === "Employer") {
                navigate('/employer/employer-dashboard');
            } else {
                localStorage.clear();
                navigate("/employer_login");
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset the error message

        try {
            const response = await axios.post(`${BACKEND_URL}/auth/employer_login`, {
                email: email,
                password: password,
            });

            if (response.data.success) {
                // Store user details in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem("role", "Employer");
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/employer/employer-dashboard'); // Redirect to employer dashboard
            } else {
                setErrorMessage(response.data.message); // Set error message from server response
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('An error occurred while logging in. Please try again later.');
        }
    };

    return (
        <div className='box'>
            <div className='nest'>
                <div className='text'>
                    <h2>Yeshwantrao Chavan College of Engineering</h2>
                    <p>“Vision: To act as a seamless conduit between the Institute and Industry, identifying the requirements of the industry, mapping them with industry readiness and core competencies of students, identifying and filling the gaps through enhanced training so as to make them relevant with the global industrial needs.</p><br />
                    <p>“Mission: To assist the holistic development of the students with balanced set of technical skills, interpersonal skills and with a positive attitude towards life and to be the interface between the Institute and Industry.</p>
                </div>

                <div className='form-box'>
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Employer Login</h2>
                        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Show error message */}
                        <div className="form-group">
                            <label htmlFor="email">Enter Email:</label>
                            <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder='Email'
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Enter Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder='Password'
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                        <div className='links'>
                            <Link className='link' to="/forget_password">Forgot Password</Link><br />
                            <Link className='link' to="/employer_register">Register</Link><br />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerLogin;
