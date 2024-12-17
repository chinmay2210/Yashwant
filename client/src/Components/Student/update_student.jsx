import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../../loader/loader';

function UpdateStudent() {
    const token = localStorage.getItem("token");
    const { state: { student } } = useLocation();
    const { state: { id } } = useLocation();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [placement, setPlacement] = useState([]);


    useEffect(() => {
        if (student) {
            console.log(student)
            setValue('name', student["Name of Student"]);
            setValue('collegeID', student["College ID"]);
            setValue('branch', student.Branch);
            setValue('section', student.Section);
            setValue('gender', student.Gender);
            setValue('dob', student.DoB);
            setValue('sscYOP', student["SSC YOP"]);
            setValue('sscPercentage', student["SSC %age"]);
            setValue('hscYOP', student["HSC YoP"]);
            setValue('hscPercentage', student["HSSC %age"]);
            setValue('sgpa1', student.SGPA1);
            setValue('sgpa2', student.SGPA2);
            setValue('sgpa3', student.SGPA3);
            setValue('sgpa4', student.SGPA4);
            setValue('sgpa5', student.SGPA5);
            setValue('sgpa6', student.SGPA6);
            setValue('sgpa7', student.SGPA7);
            setValue('avgSGPA', student["Avg. SGPA"]);
            setValue('mobile', student["mobile"]);
            setValue('personalEmail', student["Personal Email Address"]);
            setValue('collegeMailID', student["College MailID"]);
            // New fields
            setValue('skills', student.Skills || 'node, react');
            setValue('certifications', student.Certifications || '');
            setValue('placementCompany', student.PlacementCompany || 'GL');
            setValue('placementSalary', student.PlacementSalary || '500000');
            setValue('placementPosition', student.PlacementPosition || 'SDE');

            // Fetch student stats: skills, certificates, placement
            axios.get(`${BACKEND_URL}/student/get_stats/${id}`, {
                headers: {
                    'Authorization': `${token}`,
                },
            })
                .then(res => {
                    setSkills(res.data.skills);
                    setCertificates(res.data.certificates);
                    setPlacement(res.data.placement);
                })
                .catch(err => {
                    console.error(err);
                    setErrorMessage("Failed to fetch student statistics.");
                });
        } else {
            axios.get(`${BACKEND_URL}/student/get_stats/${id}`, {
                headers: {
                    'Authorization': `${token}`,
                },
            })
                .then(res => {
                    setSkills(res.data.skills);
                    setCertificates(res.data.certificates);
                    setPlacement(res.data.placement);
                    const studentData = res.data.student;
                    setValue('name', studentData["Name of Student"]);
                    setValue('collegeID', studentData["College ID"]);
                    setValue('branch', studentData.Branch);
                    setValue('section', studentData.Section);
                    setValue('gender', studentData.Gender);
                    setValue('dob', studentData.DoB);
                    setValue('sscYOP', studentData["SSC YOP"]);
                    setValue('sscPercentage', studentData["SSC %age"]);
                    setValue('hscYOP', studentData["HSC YoP"]);
                    setValue('hscPercentage', studentData["HSSC %age"]);
                    setValue('sgpa1', studentData.SGPA1);
                    setValue('sgpa2', studentData.SGPA2);
                    setValue('sgpa3', studentData.SGPA3);
                    setValue('sgpa4', studentData.SGPA4);
                    setValue('sgpa5', studentData.SGPA5);
                    setValue('sgpa6', studentData.SGPA6);
                    setValue('sgpa7', studentData.SGPA7);
                    setValue('avgSGPA', studentData["Avg. SGPA"]);
                    setValue('mobile', studentData["mobile"]);
                    setValue('personalEmail', studentData["Personal Email Address"]);
                    setValue('collegeMailID', studentData["College MailID"]);
                    setValue('skills', studentData.Skills || 'node, react');
                    setValue('certifications', studentData.Certifications || '');
                    setValue('placementCompany', studentData.PlacementCompany || 'GL');
                    setValue('placementSalary', studentData.PlacementSalary || '500000');
                    setValue('placementPosition', studentData.PlacementPosition || 'SDE');
                })
                .catch(err => {
                    console.error(err);
                    setErrorMessage("Failed to fetch student statistics.");
                });
        }
    }, [student, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await axios.put(`${BACKEND_URL}/student/update`, {
                id: student.id,
                collegeID: data.collegeID,
                name: data.name,
                branch: data.branch,
                section: data.section,
                gender: data.gender,
                dob: data.dob,
                sscYOP: data.sscYOP,
                sscPercentage: data.sscPercentage,
                hscYOP: data.hscYOP,
                hscPercentage: data.hscPercentage,
                sgpa1: data.sgpa1,
                sgpa2: data.sgpa2,
                sgpa3: data.sgpa3,
                sgpa4: data.sgpa4,
                sgpa5: data.sgpa5,
                sgpa6: data.sgpa6,
                sgpa7: data.sgpa7,
                avgSGPA: data.avgSGPA,
                mobile: data.mobile,
                personalEmail: data.personalEmail,
                collegeMailID: data.collegeMailID,
            }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 409) {
                setErrorMessage("Student already exists");
                setSuccessMessage('');
            } else if (res.status === 200) {
                setSuccessMessage("Student updated successfully");
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message || "An error occurred");
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => setErrorMessage('');
    const handleCloseSuccess = () => setSuccessMessage('');

    return (
        <div className="min-h-screen mt-16 bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                    <form className="p-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-10"> Student Profile</h1>

                        {/* Personal Information */}
                        <Section title="Personal Information">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <InputField label="Name" register={register} name="name" required />
                                <InputField label="College ID" register={register} name="collegeID" required />
                                <InputField label="Branch" register={register} name="branch" required />
                                <InputField label="Section" register={register} name="section" required />
                                <InputField label="Gender" register={register} name="gender" required />
                                <InputField label="Date of Birth" register={register} name="dob" required type="date" />
                            </div>
                        </Section>

                        {/* Academic Information */}
                        <Section title="Academic Information">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <InputField label="SSC Year of Passing" register={register} name="sscYOP" required type="number" />
                                <InputField label="SSC Percentage" register={register} name="sscPercentage" required type="number" step=".0001" />
                                <InputField label="HSC Year of Passing" register={register} name="hscYOP" required type="number" />
                                <InputField label="HSC Percentage" register={register} name="hscPercentage" required type="number" step=".0001" />
                            </div>
                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 mt-6">
                                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                    <InputField key={num} label={`SGPA ${num}`} register={register} name={`sgpa${num}`} type="number" step=".0001" />
                                ))}
                                <InputField label="Average SGPA" register={register} name="avgSGPA" required type="number" step=".0001" />
                            </div>
                        </Section>

                        {/* Contact Information */}
                        <Section title="Contact Information">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <InputField label="Phone No" register={register} name="mobile" required />
                                <InputField label="Personal Email" register={register} name="personalEmail" required type="email" />
                                <InputField label="College Email" register={register} name="collegeMailID" required type="email" />
                            </div>
                        </Section>

                        {/* Skills (Read-Only) */}
                        <Section title="Skills">
                            {skills.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {skills.map(skill => (
                                        <li key={skill.SkillID}>{skill.Skill} (Level {skill.Level})</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No skills available.</p>
                            )}
                        </Section>

                        {/* Certifications (Read-Only) */}
                        <Section title="Certifications">
                            {certificates.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {certificates.map(cert => (
                                        <li key={cert.certificateID}>
                                            {cert.certificateName} - {cert.certificateOrgnization}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No certifications available.</p>
                            )}
                        </Section>

                        {/* Placement Details (Read-Only) */}
                        <Section title="Placement Details">
                            {placement.length > 0 ? (
                                <div className="space-y-4">
                                    {placement.map(place => (
                                        <div key={place.placementID} className="p-4 border rounded-lg">
                                            <p><strong>Campus:</strong> {place.CampusName}</p>
                                            <p><strong>Package:</strong> {place.package}</p>
                                            <p><strong>Date:</strong> {new Date(place.Date).toLocaleDateString()}</p>
                                            <p><strong>Location:</strong> {place.Location}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No placement details available.</p>
                            )}
                        </Section>

                        <button type="submit" className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            Update
                        </button>
                    </form>
                </div>
            </div>
            {loading && <Loader />}
            {errorMessage && (
                <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4">
                    {errorMessage}
                    <button onClick={handleCloseError} className="float-right">&times;</button>
                </div>
            )}
            {successMessage && (
                <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4">
                    {successMessage}
                    <button onClick={handleCloseSuccess} className="float-right">&times;</button>
                </div>
            )}
        </div>
    );
}

const Section = ({ title, children }) => (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl shadow-inner">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        {children}
    </div>
);

const InputField = ({ label, register, name, required = false, type = "text", step }) => (
    <div className="relative">
        <label htmlFor={name} className="block text-sm text-start font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={name}
            {...register(name, { required })}
            type={type}
            step={step}
            className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
        />
    </div>
);

const TextAreaField = ({ label, register, name, placeholder }) => (
    <div className="relative">
        <label htmlFor={name} className="block text-sm text-start font-medium text-gray-700 mb-1">{label}</label>
        <textarea
            id={name}
            {...register(name)}
            rows="3"
            className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
            placeholder={placeholder}
        />
    </div>
);

export default UpdateStudent;
