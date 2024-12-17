import React, { useState } from 'react';
import '../LoginForm.css'; 
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../../constant';
import axios from 'axios';

const DeanLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault(); // Prevents the default form submission behavior

        try {
            // Make the API call to the backend
            const res = await axios.post(BACKEND_URL + "/auth", {
                username: username,
                password: password
            });

            if (res.status === 201) {
                if (res.data.token) {
                    localStorage.setItem("token", res.data.token);
                    navigate("/admin"); // Navigate to the home page on successful login
                }
            } else if (res.status === 401) {
                // Handle unauthorized access
                alert('Unauthorized access. Please check your credentials.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Invalid username or password.'); // Show an alert for invalid credentials
            } else {
                console.error('Error:', error); // Handle other errors
            }
        } 
    };

    return (
        <div className='box'>
            <div className='nest'>
                <div className='text'>
                    <h2>Yeshwantrao Chavan College of Engineering</h2>
                    <p>“Vision : To act as a seamless conduit between the Institute and Industry, identifying the requirements of the industry, mapping them with industry readiness and core competencies of students, identifying and filling the gaps through enhanced training so as to make them relevant with the global industrial needs</p><br></br>
                    <p>“Mission : To assist the holistic development of the students with balanced set of technical skills, interpersonal skills and with a positive attitude towards life and to be the interface between the Institute and Industry.</p>
                </div>
                
                <div className='form-box'>
                    <form onSubmit={onSubmit} className="login-form">
                        <h2>Dean Login</h2>
                        <div className="form-group">
                            <label htmlFor="username">Enter Email:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                            <Link className='link' to="/forgotpassword">Forgot Password?</Link><br />
                            <Link className='link' to="/register">Register Now</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeanLogin;
