import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../../constant';
import '../LoginForm.css'; 

const StudentLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Effect to check if token exists in localStorage and redirect if it does
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const role = localStorage.getItem("role")
            if(role == "Student"){
                navigate('/student-dashboard'); 
            }else{
                localStorage.clear()
                navigate("/student_login")
            }
            
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const fcmToken = await getFcmToken(); // Assuming you have a function to get FCM Token
            const response = await axios.post(`${BACKEND_URL}/auth/student_login`, {
                email: username,
                password: password,
                mtoken: fcmToken
            });

            if (response.data.success) {
                if (response.data.new_user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    navigate('/new_password'); // Redirect to new password screen
                } else {
                    // Store user details in localStorage
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem("role","Student");
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    navigate('/student-dashboard'); // Redirect to student dashboard
                }
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
    };

    const getFcmToken = async () => {
        // Logic to get FCM token (if using Firebase Messaging)
        // For now, return a placeholder token
        return 'placeholder_token';
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
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Student Login</h2>
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
                            <Link className='link' to="/forget_password">Forgot Password </Link><br />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
