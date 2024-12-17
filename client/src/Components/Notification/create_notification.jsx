import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constant";
import Loader from "../../loader/loader";

function CreateNotification() {
    const token = localStorage.getItem("token");
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        shortLine: '',
        paragraphs: [],
    });
    const [loading, setLoading] = useState(false); // Add loading state

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleParagraphsChange = (event) => {
        const noOfParagraphs = parseInt(event.target.value, 10);
        const paragraphsArray = Array.from({ length: noOfParagraphs }, () => '');
        setFormData({ ...formData, paragraphs: paragraphsArray });
    };

    const handleParagraphInputChange = (index, event) => {
        const { value } = event.target;
        const paragraphs = [...formData.paragraphs];
        paragraphs[index] = value;
        setFormData({ ...formData, paragraphs });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true); // Set loading to true when form is submitted

        try {
            console.log(formData);
            const response = await axios.post(BACKEND_URL + "/notification/add_notification", formData, {
                headers: {
                    'Authorization': `${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 201) {
                setSuccessMessage(response.data.message);
                setErrorMessage('');
            } else if (response.status === 409) {
                setErrorMessage(response.data.message);
                setSuccessMessage("");
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Something went wrong");
                setSuccessMessage("");
            } else if (error.request) {
                setErrorMessage("No response from server. Please try again later.");
                setSuccessMessage("");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
                setSuccessMessage("");
            }
        } finally {
            setLoading(false); // Set loading to false after form submission completes
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
                    {loading ? ( // Display loader while loading
                        <Loader />
                    ) : (
                        <form className="form" onSubmit={handleSubmit}>
                            <p className="title">Create Notification</p>
                            <p className="message">Fill notification details in the form.</p>

                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    name="title"
                                    placeholder=""
                                    required
                                    onChange={handleInputChange}
                                />
                                <span>Title</span>
                            </label>
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    name="shortLine"
                                    placeholder=""
                                    required
                                    onChange={handleInputChange}
                                />
                                <span>Short Line</span>
                            </label>
                            <label>
                                <input
                                    id="noOfParagraphs"
                                    className="input"
                                    type="number"
                                    placeholder=""
                                    required
                                    onChange={handleParagraphsChange}
                                />
                                <span>No of Paragraphs</span>
                            </label>
                            {formData.paragraphs.map((paragraph, index) => (
                                <div key={index} className="paragraph-container">
                                    <label>
                                        <textarea
                                            className="input"
                                            name={`paragraph${index}`}
                                            placeholder=""
                                            required
                                            onChange={(event) => handleParagraphInputChange(index, event)}
                                        />
                                        <span>Paragraph {index + 1}</span>
                                    </label>
                                </div>
                            ))}
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

export default CreateNotification;
