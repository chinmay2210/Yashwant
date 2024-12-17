import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../../constant";
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

const ResumeUpload = () => {
    const [resumeType, setResumeType] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [studentID, setStudentID] = useState(null);
    const [token, setToken] = useState("");
    const [videoDuration, setVideoDuration] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [pdfData, setPdfData] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.id) {
            setStudentID(storedUser.id);
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                fetchResumes(storedUser.id, storedToken);
            } else {
                setMessage("User is not authorized.");
            }
        } else {
            setMessage("No user found.");
        }
    }, []);

    const fetchResumes = async (studentID, token) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/resume/${studentID}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            console.log(response.data);
            setResumes(response.data);
        } catch (error) {
            console.error("Error fetching resumes:", error);
            setMessage("Error fetching resumes.");
        }
    };

    const handleResumeTypeChange = (e) => {
        setResumeType(e.target.value);
        setSelectedFile(null);
        setMessage("");
        setVideoDuration(null);
        setPdfData(null);
        setPageNumber(1); // Reset page number when changing resume type
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setMessage("");

        if (resumeType === "video") {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                const duration = video.duration;
                setVideoDuration(duration);
                if (duration > 2000) {
                    setMessage("Video resume should not exceed 25 seconds.");
                    setSelectedFile(null);
                }
            };

            video.src = URL.createObjectURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentID) {
            setMessage("Student ID not found.");
            return;
        }

        if (selectedFile) {
            if (resumeType === "video" && videoDuration > 25) {
                setMessage("Video resume exceeds 25 seconds limit.");
                return;
            }

            const formData = new FormData();
            formData.append("resume", selectedFile);
            formData.append("resume_type", resumeType);
            formData.append("studentID", studentID);

            try {
                setUploading(true);
                const response = await axios.post(BACKEND_URL + "/resume/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `${token}`,
                    },
                });
                setMessage("Upload successful!");
                fetchResumes(studentID, token);
            } catch (error) {
                console.error("Error uploading resume:", error);
                setMessage("Error uploading file. Please try again.");
            } finally {
                setUploading(false);
            }
        } else {
            setMessage("Please select a file to upload.");
        }
    };

    const openPdf = (resume) => {
        if (resume.resume_type === 'pdf' && resume.resume_data) {
            const byteCharacters = atob(resume.resume_data); // Decode base64 string
            const byteNumbers = new Uint8Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            // Open the PDF in a new tab
            window.open(url, '_blank');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Upload Your Resume</h2>

            <label className="block text-lg mb-2">Select Resume Type:</label>
            <select
                value={resumeType}
                onChange={handleResumeTypeChange}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">-- Select --</option>
                <option value="pdf">PDF Resume</option>
                <option value="video">Video Resume</option>
            </select>

            {resumeType && (
                <div className="mb-4">
                    <label className="block text-lg mb-2">
                        Upload {resumeType === "pdf" ? "PDF" : "Video"}:
                    </label>
                    <input
                        type="file"
                        accept={resumeType === "pdf" ? ".pdf" : "video/mp4,video/x-m4v,video/*"}
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            {message && (
                <div className={`mt-4 text-center ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                    {message}
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={!resumeType || uploading || (!selectedFile && resumeType === "video" && videoDuration > 25)}
                className={`w-full px-4 py-2 mt-4 text-white font-semibold rounded-md ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
                {uploading ? "Uploading..." : "Submit"}
            </button>

            {/* Display fetched resumes */}
            <h3 className="text-xl font-semibold mt-6 mb-2">Your Resumes:</h3>
            {resumes.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {resumes.map((resume, index) => (
                        <div key={index} className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold">{resume.resume_type === "pdf" ? "PDF Resume" : "Video Resume"}</h4>
                                <span className="text-gray-600">{new Date(resume.uploaded_at).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-2">
                                {resume.resume_type === "pdf" ? (
                                    <button
                                        onClick={() => openPdf(resume)}
                                        className="mt-2 text-blue-500 hover:underline"
                                    >
                                        View PDF Resume
                                    </button>
                                ) : (
                                    <video
                                        src={resume.resume_url}
                                        controls
                                        className="w-full h-64 mt-2"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No resumes uploaded yet.</p>
            )}

            {/* PDF Viewer (if needed) */}
            {pdfData && (
                <div className="mt-4">
                    <Document file={pdfData}>
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <div className="flex justify-between mt-2">
                        <button onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))} disabled={pageNumber === 1}>Previous</button>
                        <button onClick={() => setPageNumber(prev => prev + 1)}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
