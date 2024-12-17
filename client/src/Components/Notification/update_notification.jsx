import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../loader/loader";
import { BACKEND_URL } from "../../constant";

function UpdateNotification() {
    const { state } = useLocation();
    const { notification } = state || {}; // Notification object passed from the previous screen
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: notification?.Title || '',
        shortLine: notification?.ShortLine || '',
        paragraphs: notification?.messages.map(msg => msg.message) || [],
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!notification) {
            navigate("/"); // Redirect if no notification object is passed
        }
    }, [notification, navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleParagraphInputChange = (index, event) => {
        const { value } = event.target;
        const paragraphs = [...formData.paragraphs];
        paragraphs[index] = value;
        setFormData({ ...formData, paragraphs });
    };

    const addParagraph = () => {
        setFormData({
            ...formData,
            paragraphs: [...formData.paragraphs, ''] // Add an empty string for a new paragraph
        });
    };

    const removeParagraph = (index) => {
        const paragraphs = formData.paragraphs.filter((_, i) => i !== index);
        setFormData({ ...formData, paragraphs });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(`${BACKEND_URL}/notification/update_notification/${notification.nID}`, {
                title: formData.title,
                shortLine: formData.shortLine,
                paragraphs: formData.paragraphs,
            }, {
                headers: {
                    'Authorization': `${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                setSuccessMessage('Notification updated successfully');
                setErrorMessage('');
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
            setLoading(false);
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
                        <Loader />
                    ) : (
                        <form className="form" onSubmit={handleSubmit}>
                            <p className="title">Update Notification</p>
                            <p className="message">Update the notification details below.</p>

                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    name="title"
                                    placeholder=""
                                    required
                                    value={formData.title}
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
                                    value={formData.shortLine}
                                    onChange={handleInputChange}
                                />
                                <span>Short Line</span>
                            </label>

                            {formData.paragraphs.map((paragraph, index) => (
                                <div key={index} className="paragraph-container">
                                    <label>
                                        <textarea
                                            className="input"
                                            name={`paragraph${index}`}
                                            placeholder=""
                                            required
                                            value={paragraph}
                                            onChange={(event) => handleParagraphInputChange(index, event)}
                                        />
                                        <span>Paragraph {index + 1}</span>
                                    </label>
                                    <button type="button" onClick={() => removeParagraph(index)}>
                                        Remove Paragraph
                                    </button>
                                </div>
                            ))}

                            <button type="button" onClick={addParagraph}>
                                Add Paragraph
                            </button>

                            <button className="submit">Update</button>
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

export default UpdateNotification;
