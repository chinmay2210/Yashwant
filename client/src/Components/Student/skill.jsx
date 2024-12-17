import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from '../../constant';
import Loader from '../../loader/loader';
import {skills} from '../../constant.js'

function AddSkill() {
    const token = localStorage.getItem("token");
    const [skill, setSkill] = useState('');
    const [level, setLevel] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSkillChange = (event) => {
        setSkill(event.target.value);
    };

    const handleLevelChange = (event) => {
        setLevel(event.target.value);
    };

    const downloadStudents = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(BACKEND_URL + "/skill/download", {
                skill: skill,
                level: level
            }, {
                headers: {
                    'Authorization': token,
                },
                responseType: 'blob',
            });

            if (res.status === 200) {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                const filename = `Student_${skill.replace(/\s+/g, '_')}.xlsx`;
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                setSuccessMessage("File downloaded successfully.");
            } else {
                setErrorMessage("Failed to download file.");
            }
        } catch (error) {
            setErrorMessage("Something went wrong!");
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
                    <form className="form" onSubmit={downloadStudents}>
                        <p className="title">Download Students by Skill</p>
                        <label>
                            <select className="input" value={skill} onChange={handleSkillChange} required>
                                <option value="" disabled>Select Skill</option>
                                {skills.map((skill, index) => (
                                    <option key={index} value={skill}>{skill}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <input className="input" type="number" min="1" max="10" value={level} onChange={handleLevelChange} placeholder="Enter Level (Optional)" />
                        </label>
                        <button className="submit">Submit</button>
                    </form>
                    {loading && <Loader />}
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

export default AddSkill;
