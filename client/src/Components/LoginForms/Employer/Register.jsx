import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Importing React-Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importing React-Toastify CSS
import { BACKEND_URL } from '../../../constant';

const EmployerRegister = () => {
    const [username, setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [recievedOtp,setRecivedOtp] = useState(0);
    const [otpSent, setOtpSent] = useState(false); // To track if OTP is sent
    const navigate = useNavigate();

    // Effect to check if token exists in localStorage and redirect if it does
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const role = localStorage.getItem("role");
            if(role ==  "Employer"){
                navigate('/employer-dashboard');
            }
            // Redirect to student dashboard if token exists
        }
    }, [navigate]);

    // Handler for sending OTP
    const handleSendOtp = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/request_otp`, {
                email: email,
            });

            if (response.status === 200) {
                setOtpSent(true); 
                console.log("here")
                setRecivedOtp(response.data.otp);
                console.log("here")
                toast.success('OTP sent to your email.'); // Success toast
            } else {
                toast.error("error"); // Error toast
            }
        } catch (error) {
            toast.error('Error sending OTP. Please try again.');
        }
    };

    // Handler for OTP submission and registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otpSent) {
            handleSendOtp();
            return;
        }
        if(recievedOtp!=otp){
            toast.error("OTP is not correct!");
        }else{
            try {
                const response = await axios.post(`${BACKEND_URL}/auth/employer_registration`, {
                    employerName: username,
                    employerEmail: email,
                    employerPassword: password,
                });
    
                if (response.data.success) {
                    toast.success('Employer registered successfully.');
                    navigate('/employer_login'); // Redirect to the dashboard or home page
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error('Error during registration. Please try again later.');
            }
        }

     
    };

    return (
        <div className='box'>
            <div className='nest'>
                <div className='text'>
                    <h2>Yeshwantrao Chavan College of Engineering</h2>
                    <p>“Vision: To act as a seamless conduit between the Institute and Industry, identifying the requirements of the industry, mapping them with industry readiness and core competencies of students...”</p>
                    <p>“Mission: To assist the holistic development of students with a balanced set of technical skills...”</p>
                </div>

                <div className='form-box'>
                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Employer Registration</h2>
                        <div className="form-group">
                            <label htmlFor="username">Company Name:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder='Company Name'
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Enter Email:</label>
                            <input
                                type="email"
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

                        {otpSent && (
                            <div className="form-group">
                                <label htmlFor="otp">Enter OTP:</label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    placeholder='Enter OTP'
                                />
                            </div>
                        )}

                        <button type="submit" className="login-button">
                            {otpSent ? 'Submit OTP' : 'Send OTP'}
                        </button>

                        <div className='links'>
                            <Link className='link' to="/forget_password">Forgot Password</Link><br />
                            <Link className='link' to="/employer_login">Login</Link><br />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployerRegister;
