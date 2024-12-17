import { React, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BACKEND_URL} from '../../../constant'
const Forgetpassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const [stage, setStage] = useState(1);
    const [otp, setOtp] = useState(""); // State to store OTP
    const [email, setEmail] = useState(""); 

    const onSubmit = async (data) => {
        if (stage === 1) {
            await sendOTP(data);
        } else if (stage === 2) {
            await verifyOtp(data);
        } else if (stage === 3) {
            await submitNewPassword(data);
        }
    };

    const sendOTP = async (data) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/student_forget_password`, { email: data.email });
    
            if (response.status === 200) {
                // OTP was sent successfully
                setOtp(response.data.otp); 
                setEmail(data.email); // Store email for later use
                setStage(2); // Move to the OTP verification stage
                toast.success("OTP has been sent to your email.");
            } else if (response.status === 400) {
                // Bad request, email is missing
                toast.error(response.data.message || "Email is required.");
            } else if (response.status === 404) {
                // User not found
                toast.error(response.data.message || "User with this email does not exist.");
            } else {
                // Handle other unexpected status codes
                toast.error(response.data.message || "An unexpected error occurred.");
            }
        } catch (error) {
            // Handle network or server errors
            if (error.response) {
                // Server responded with a status other than 200 range
                toast.error(error.response.data.message || "An error occurred while sending OTP.");
            } else if (error.request) {
                // Request was made but no response received
                toast.error("No response received from server. Please try again.");
            } else {
                // Something else caused the error
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    };
    

    const verifyOtp = async (data) => {
        const enteredOtp = data.otp;

        if (enteredOtp === otp) {
            setStage(3); // Move to the password reset stage
            toast.success("OTP verified successfully.");
        } else {
            toast.error("Invalid OTP. Please try again.");
        }
    };

    const submitNewPassword = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/auth/student_update_password`, {
                email: email,
                password: data.password,
                mtoken: data.mtoken || null, // Optionally send FCM token
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                localStorage.clear();
                localStorage.setItem("token", response.data.token);
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the password.");
        }
    };

    return (
         <div className='h-screen mt-32 py-16 md:w-1/2 mx-auto justify-center items-center p-4'>
            <div className='bg-white rounded-lg shadow-xl p-8'>
                <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                    <h1 className='text-3xl font-bold text-center text-blue-800 mb-6'>Forget Password</h1>
                    <div className="space-y-4">
                        {stage === 1 && (
                            <div>
                                <input
                                    type="email"
                                    name='email'
                                    placeholder='Enter Registered Email'
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                                    {...register("email", {
                                        required: "Please Enter Registered Email"
                                    })}
                                />
                                {errors?.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
                            </div>
                        )}
                        {stage === 2 && (
                            <div>
                                <input
                                    type="text"
                                    name='otp'
                                    placeholder='Enter OTP'
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                                    {...register("otp", {
                                        required: "Please Enter OTP"
                                    })}
                                />
                                {errors?.otp && <p className='text-red-500 text-sm mt-1'>{errors.otp.message}</p>}
                            </div>
                        )}
                        {stage === 3 && (
                            <>
                                <div>
                                    <input
                                        type="password"
                                        name='password'
                                        placeholder='Enter New Password'
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                                        {...register("password", {
                                            required: "Please Enter New Password",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters long"
                                            }
                                        })}
                                    />
                                    {errors?.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        name='confirmPassword'
                                        placeholder='Confirm New Password'
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500'
                                        {...register("confirmPassword", {
                                            required: "Please Confirm Your Password",
                                            validate: value => value === watch('password') || "Passwords do not match"
                                        })}
                                    />
                                    {errors?.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message}</p>}
                                </div>
                            </>
                        )}
                        <button 
                            type="submit" 
                            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                        >
                            {stage === 1 ? "Send OTP" : stage === 2 ? "Verify OTP" : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Forgetpassword;
