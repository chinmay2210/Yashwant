import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Document, Page } from "react-pdf";
import { BACKEND_URL } from "../../../../constant";

const ResumeViewer = () => {
    const [resumes, setResumes] = useState([]);
    const [pdfData, setPdfData] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const location = useLocation();

    // Extract studentID from the query params or URL
    const studentID = new URLSearchParams(location.search).get("studentID");

    useEffect(() => {
        if (studentID) {
            fetchResumes(studentID);
        }
    }, [studentID]);

    const fetchResumes = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}/resume/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setResumes(response.data);
        } catch (error) {
            console.error("Error fetching resumes:", error);
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
        <div className="mt-20">
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">Resume Viewer</h2>

                {resumes.length > 0 ? (
                    resumes.map((resume, index) => (
                        <div key={index} className="mb-8 border rounded-lg shadow-md p-4 bg-gray-50">
                            <h3 className="font-semibold text-lg">{resume.resume_type === "pdf" ? "PDF Resume" : "Video Resume"}</h3>
                            {resume.resume_type === "pdf" ? (
                                <div>
                                    <button
                                        onClick={() => openPdf(resume)} // Pass the whole resume object
                                        className="text-blue-500 underline mb-2"
                                    >
                                        View PDF Resume
                                    </button>
                                    {pdfData && (
                                        <div className="mt-4">
                                            <Document file={pdfData}>
                                                <Page pageNumber={pageNumber} />
                                            </Document>
                                            <div className="mt-2">
                                                <button
                                                    onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                                                    className="mr-2 px-2 py-1 bg-gray-300 rounded"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={() => setPageNumber((prev) => prev + 1)}
                                                    className="px-2 py-1 bg-gray-300 rounded"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <video
                                        src={resume.resume_url}
                                        controls
                                        className="w-full h-64 mt-2 rounded-lg shadow-md"
                                    />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No resumes found for this student.</p>
                )}
            </div>
        </div>
    );
};

export default ResumeViewer;
