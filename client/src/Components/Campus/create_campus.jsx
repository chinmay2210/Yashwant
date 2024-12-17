import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constant";
import Loader from '../../loader/loader'; 

export const BRANCHES = [
    'Comp Tech', 'Info Tech', 'Electronics', 'ETC', 'Electrical',
    'Mechanical', 'Civil', 'AI-DS', 'AIML', 'IIOT', 'CSD'
];

function CreateCampus() {
    const token = localStorage.getItem("token");
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        campusName: '',
        message: '',
        pack: '',
        location: '',
        file: null,
        rounds: [],
        eligibilityType: 'excel', // 'excel' or 'criteria'
        selectedBranches: [],
        liveBacklogAllowed: 'no', // 'yes' or 'no'
        liveBacklogCount: '',
        deadBacklogAllowed: 'no', // 'yes' or 'no'
        deadBacklogCount: '',
        cgpa: ''
    });
    const [loading, setLoading] = useState(false);

    // Handle general input changes
    const handleInputChange = (event) => {
        const { name, value, type, files } = event.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else if (name === "eligibilityType") {
            setFormData({ 
                ...formData, 
                eligibilityType: value,
                // Reset criteria fields when switching to 'excel'
                ...(value === 'excel' ? {
                    selectedBranches: [],
                    liveBacklogAllowed: 'no',
                    liveBacklogCount: '',
                    deadBacklogAllowed: 'no',
                    deadBacklogCount: '',
                    cgpa: ''
                } : {
                    file: null
                })
            });
        } else if (name === "selectedBranches") {
            const options = event.target.options;
            const selected = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    selected.push(options[i].value);
                }
            }
            setFormData({ ...formData, selectedBranches: selected });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle Live Backlog Selection
    const handleLiveBacklogChange = (event) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            liveBacklogAllowed: value,
            // Reset count if 'no' is selected
            ...(value === 'no' ? { liveBacklogCount: '' } : {})
        });
    };

    // Handle Dead Backlog Selection
    const handleDeadBacklogChange = (event) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            deadBacklogAllowed: value,
            // Reset count if 'no' is selected
            ...(value === 'no' ? { deadBacklogCount: '' } : {})
        });
    };

    // Handle number of rounds input
    const handleRoundsChange = (event) => {
        const noOfRounds = parseInt(event.target.value, 10);
        if (isNaN(noOfRounds) || noOfRounds < 0) {
            setFormData({ ...formData, rounds: [] });
            return;
        }
        const roundsArray = Array.from({ length: noOfRounds }, () => ({ roundName: '', roundDate: '' }));
        setFormData({ ...formData, rounds: roundsArray });
    };

    // Handle individual round input changes
    const handleRoundInputChange = (index, event) => {
        const { name, value } = event.target;
        const rounds = [...formData.rounds];
        rounds[index][name] = value;
        setFormData({ ...formData, rounds });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (formData.eligibilityType === 'excel') {
            await handleExcelUpload();
        } else {
            await handleCriteriaSubmit();
        }

        setLoading(false);
    };

    // Handler for Excel upload
    const handleExcelUpload = async () => {
        const data = new FormData();
        data.append("campusName", formData.campusName);
        data.append("message", formData.message);
        data.append("pack", formData.pack);
        data.append("location", formData.location);
        data.append("file", formData.file);
        formData.rounds.forEach((round, index) => {
            data.append(`rounds[${index}][roundName]`, round.roundName);
            data.append(`rounds[${index}][roundDate]`, round.roundDate);
        });

        try {
            const response = await axios.post(BACKEND_URL + "/campus/create", data, {
                headers: {
                    'Authorization': `${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                setErrorMessage('');
                resetForm();
            } else if (response.status === 409) {
                setErrorMessage(response.data.message);
                setSuccessMessage("");
            }
        } catch (error) {
            handleError(error);
        }
    };

    // Handler for Criteria submission
    const handleCriteriaSubmit = async () => {
        // Validate criteria fields
        if (formData.selectedBranches.length === 0) {
            setErrorMessage("Please select at least one branch.");
            setSuccessMessage("");
            return;
        }

        if (formData.liveBacklogAllowed === 'yes' && !formData.liveBacklogCount) {
            setErrorMessage("Please specify the number of live backlogs allowed.");
            setSuccessMessage("");
            return;
        }

        if (formData.deadBacklogAllowed === 'yes' && !formData.deadBacklogCount) {
            setErrorMessage("Please specify the number of dead backlogs allowed.");
            setSuccessMessage("");
            return;
        }

        const data = {
            campusName: formData.campusName,
            message: formData.message,
            pack: formData.pack,
            location: formData.location,
            rounds: formData.rounds,
            eligibility: {
                selectedBranches: formData.selectedBranches,
                liveBacklogAllowed: formData.liveBacklogAllowed === 'yes',
                liveBacklogCount: formData.liveBacklogAllowed === 'yes' ? parseInt(formData.liveBacklogCount, 10) : 0,
                deadBacklogAllowed: formData.deadBacklogAllowed === 'yes',
                deadBacklogCount: formData.deadBacklogAllowed === 'yes' ? parseInt(formData.deadBacklogCount, 10) : 0,
                cgpa: parseFloat(formData.cgpa)
            }
        };

        try {
            const response = await axios.post(`${BACKEND_URL}/campus/create/criteria`, data, {
                headers: {
                    'Authorization': `${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                setSuccessMessage(response.data.message);
                setErrorMessage('');
                resetForm();
            } else if (response.status === 409) {
                setErrorMessage(response.data.message);
                setSuccessMessage("");
            }
        } catch (error) {
            handleError(error);
        }
    };

    // Common error handler
    const handleError = (error) => {
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
    };

    // Reset form after successful submission
    const resetForm = () => {
        setFormData({
            campusName: '',
            message: '',
            pack: '',
            location: '',
            file: null,
            rounds: [],
            eligibilityType: 'excel',
            selectedBranches: [],
            liveBacklogAllowed: 'no',
            liveBacklogCount: '',
            deadBacklogAllowed: 'no',
            deadBacklogCount: '',
            cgpa: ''
        });
    };

    // Handlers to close error and success messages
    const handleCloseError = () => {
        setErrorMessage('');
    };

    const handleCloseSuccess = () => {
        setSuccessMessage('');
    };

    return (
        <div className="center vs1">
            {loading ? (
                <Loader />
            ) : (
                <form className="form" onSubmit={handleSubmit}>
                    <p className="title">Create Campus</p>
                    <p className="message">Fill campus details in the form.</p>

                    {/* Eligibility Type Selection */}
                    <div className="eligibility-type mb-4">
                        <label className="inline-flex items-center mr-4">
                            <input
                                type="radio"
                                name="eligibilityType"
                                value="excel"
                                checked={formData.eligibilityType === 'excel'}
                                onChange={handleInputChange}
                                className="form-radio"
                            />
                            <span className="ml-2">Upload Excel Sheet</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="eligibilityType"
                                value="criteria"
                                checked={formData.eligibilityType === 'criteria'}
                                onChange={handleInputChange}
                                className="form-radio"
                            />
                            <span className="ml-2">Create Criteria Manually</span>
                        </label>
                    </div>

                    {/* Campus Details */}
                    <label className="block mb-4 relative">
                        <input
                            className="input"
                            type="text"
                            name="campusName"
                            placeholder=" "
                            required
                            value={formData.campusName}
                            onChange={handleInputChange}
                        />
                        <span className="input-label">Campus Name</span>
                    </label>
                    <label className="block mb-4 relative">
                        <input
                            className="input"
                            type="text"
                            name="message"
                            placeholder=" "
                            required
                            value={formData.message}
                            onChange={handleInputChange}
                        />
                        <span className="input-label">Message</span>
                    </label>
                    <label className="block mb-4 relative">
                        <input
                            className="input"
                            type="text"
                            name="pack"
                            placeholder=" "
                            required
                            value={formData.pack}
                            onChange={handleInputChange}
                        />
                        <span className="input-label">Package</span>
                    </label>
                    <label className="block mb-4 relative">
                        <input
                            className="input"
                            type="text"
                            name="location"
                            placeholder=" "
                            required
                            value={formData.location}
                            onChange={handleInputChange}
                        />
                        <span className="input-label">Location</span>
                    </label>

                    {/* Conditional Rendering Based on Eligibility Type */}
                    {formData.eligibilityType === 'excel' ? (
                        <label className="block mb-4 relative">
                            <input
                                className="input"
                                type="file"
                                name="file"
                                placeholder=" "
                                required
                                onChange={handleInputChange}
                                accept=".xls,.xlsx"
                            />
                            <span className="input-label">Excel File</span>
                        </label>
                    ) : (
                        <div className="criteria-section mb-4">
                            {/* Select Branches */}
                            <label className="block mb-4 relative">
                                <select
                                    className="input h-auto"
                                    name="selectedBranches"
                                    multiple
                                    required
                                    value={formData.selectedBranches}
                                    onChange={handleInputChange}
                                >
                                    {BRANCHES.map((branch, index) => (
                                        <option key={index} value={branch}>
                                            {branch}
                                        </option>
                                    ))}
                                </select>
                                <span className="input-label">Select Branches (Ctrl + Click to select multiple)</span>
                            </label>

                            {/* Live Backlogs Allowed */}
                            <div className="mb-4">
                                <span className="block mb-2">Live Backlogs Allowed:</span>
                                <label className="inline-flex items-center mr-4">
                                    <input
                                        type="radio"
                                        name="liveBacklogAllowed"
                                        value="yes"
                                        checked={formData.liveBacklogAllowed === 'yes'}
                                        onChange={handleLiveBacklogChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="liveBacklogAllowed"
                                        value="no"
                                        checked={formData.liveBacklogAllowed === 'no'}
                                        onChange={handleLiveBacklogChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {formData.liveBacklogAllowed === 'yes' && (
                                <label className="block mb-4 relative">
                                    <input
                                        className="input"
                                        type="number"
                                        name="liveBacklogCount"
                                        placeholder=" "
                                        required
                                        min="0"
                                        value={formData.liveBacklogCount}
                                        onChange={handleInputChange}
                                    />
                                    <span className="input-label">Number of Live Backlogs Allowed</span>
                                </label>
                            )}

                            {/* Dead Backlogs Allowed */}
                            <div className="mb-4">
                                <span className="block mb-2">Dead Backlogs Allowed:</span>
                                <label className="inline-flex items-center mr-4">
                                    <input
                                        type="radio"
                                        name="deadBacklogAllowed"
                                        value="yes"
                                        checked={formData.deadBacklogAllowed === 'yes'}
                                        onChange={handleDeadBacklogChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="deadBacklogAllowed"
                                        value="no"
                                        checked={formData.deadBacklogAllowed === 'no'}
                                        onChange={handleDeadBacklogChange}
                                        className="form-radio"
                                    />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {formData.deadBacklogAllowed === 'yes' && (
                                <label className="block mb-4 relative">
                                    <input
                                        className="input"
                                        type="number"
                                        name="deadBacklogCount"
                                        placeholder=" "
                                        required
                                        min="0"
                                        value={formData.deadBacklogCount}
                                        onChange={handleInputChange}
                                    />
                                    <span className="input-label">Number of Dead Backlogs Allowed</span>
                                </label>
                            )}

                            {/* CGPA */}
                            <label className="block mb-4 relative">
                                <input
                                    className="input"
                                    type="number"
                                    name="cgpa"
                                    placeholder=" "
                                    required
                                    min="0"
                                    max="10"
                                    step="0.01"
                                    value={formData.cgpa}
                                    onChange={handleInputChange}
                                />
                                <span className="input-label">Minimum CGPA</span>
                            </label>
                        </div>
                    )}

                    {/* Number of Rounds */}
                    <label className="block mb-4 relative">
                        <input
                            id="noOfRound"
                            className="input"
                            type="number"
                            name="noOfRounds"
                            placeholder=" "
                            required
                            min="0"
                            value={formData.rounds.length}
                            onChange={handleRoundsChange}
                        />
                        <span className="input-label">No. of Rounds</span>
                    </label>

                    {/* Dynamic Rounds Inputs */}
                    {formData.rounds.map((round, index) => (
                        <div key={index} className="round-container mb-4">
                            <label className="block mb-2 relative">
                                <input
                                    className="input"
                                    type="text"
                                    name="roundName"
                                    placeholder=" "
                                    required
                                    value={round.roundName}
                                    onChange={(event) => handleRoundInputChange(index, event)}
                                />
                                <span className="input-label">Round {index + 1} Name</span>
                            </label>
                            <label className="block mb-4 relative">
                                <input
                                    className="input"
                                    type="date"
                                    name="roundDate"
                                    placeholder=" "
                                    required
                                    value={round.roundDate}
                                    onChange={(event) => handleRoundInputChange(index, event)}
                                />
                                <span className="input-label">Round {index + 1} Date</span>
                            </label>
                        </div>
                    ))}

                    {/* Submit Button */}
                    <button type="submit" className="submit">Submit</button>
                </form>
            )}

            {/* Error Message Popup */}
            {errorMessage && (
                <div className="popup error-popup">
                    <span className="close-btn" onClick={handleCloseError}>&times;</span>
                    <div className="popup-message">{errorMessage}</div>
                </div>
            )}

            {/* Success Message Popup */}
            {successMessage && (
                <div className="popup success-popup">
                    <span className="close-btn" onClick={handleCloseSuccess}>&times;</span>
                    <div className="popup-message">{successMessage}</div>
                </div>
            )}
        </div>
    );
}

export default CreateCampus;
