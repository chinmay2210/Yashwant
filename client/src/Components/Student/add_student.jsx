import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from '../../constant';
import Loader from '../../loader/loader' 

function AddStudent() {
    const token = localStorage.getItem("token")
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // State to manage loading

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = async (event) => {
        event.preventDefault(); // Prevent form submission
        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post(BACKEND_URL + "/student/upload", formData,{
                headers: {
                    'Authorization': token,
                },
            });
            if (res.status === 400) {
                setErrorMessage("No file uploaded");
            } else if (res.status === 200) {
                setSuccessMessage(res.data.message);
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (error) {
            setErrorMessage("Something went wrong!");
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
                    <form className="form" onSubmit={uploadFile}>
                        <p className="title">Student Data</p>
                        <p className="message">List of Student Registerd with T&P Cell 2025</p>
                        <label>
                            <input className="input" onChange={handleFileUpload} type="file" required />
                            <span>XLS File</span>
                        </label>
                        <button className="submit">Submit</button>
                    </form>
                    {loading && <Loader />} {/* Show loader when loading */}
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

export default AddStudent;
