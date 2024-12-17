import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import { BACKEND_URL, BRANCHS, skills } from '../../../../constant.js';
import './shimmer.css';

// Form Validation Schema using Yup
const validationSchema = Yup.object().shape({
  skill: Yup.array().required('At least one skill is required'),
  skillLevel: Yup.number().min(1, 'Minimum level is 1').max(10, 'Maximum level is 10').required('Skill level is required'),
  cgpa: Yup.number().min(0, 'Minimum CGPA is 0').max(10, 'Maximum CGPA is 10'),
});

const ShortListStudent = () => {
  const initialValues = {
    skill: [],
    skillLevel: '',
    cgpa: '',
    branch: [],
    hasSkillCertificate: false,
  };

  const handleSubmit = async (values) => {
    try {
      // Get token and user from localStorage
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(token, user);
      // Destructure employerID from user
      const { employerID } = user;

      // Set up the Axios request configuration
      const config = {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      };

      // Prepare the request payload
      const payload = {
        ...values,
        employerID, // Adding employerID from user data
      };
      console.log(values);
      // Make the POST request to the handler (adjust the URL as needed)
      const response = await axios.post(BACKEND_URL + '/employer/request_student_data', payload, config);

      // Handle success
      console.log('Request successful:', response.data);
      alert('Request submitted successfully!');
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Error response:', error.response.data);
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        // Request was made but no response was received
        console.error('Error request:', error.request);
        alert('No response from the server. Please try again.');
      } else {
        // Something else caused the error
        console.error('Error:', error.message);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="shortlist-student-form-custom">
          <div className="shortlist-field-container-custom">
            <label>Skills</label>
            <Select
              isMulti
              name="skill"
              options={skills.map((skill) => ({ label: skill, value: skill }))}
              className="basic-multi-select shortlist-select-custom"
              classNamePrefix="select"
              onChange={(selectedOptions) =>
                setFieldValue('skill', selectedOptions.map((option) => option.value))
              }
            />
            <ErrorMessage name="skill" component="div" className="error-message-custom" />
          </div>

          <div className="shortlist-field-container-custom">
            <label>Skill Level</label>
            <Field as="select" name="skillLevel" className="shortlist-field-custom">
              <option value="">Select Level</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Field>
            <ErrorMessage name="skillLevel" component="div" className="error-message-custom" />
          </div>

          <div className="shortlist-field-container-custom">
            <label>CGPA</label>
            <Field
              type="number"
              name="cgpa"
              placeholder="CGPA (0-10)"
              step="0.1"
              className="shortlist-field-custom"
            />
            <ErrorMessage name="cgpa" component="div" className="error-message-custom" />
          </div>

          <div className="shortlist-field-container-custom">
            <label>Branch</label>
            <Select
              isMulti
              name="branch"
              options={BRANCHS.map((branch) => ({ label: branch, value: branch }))}
              className="basic-multi-select shortlist-select-custom"
              classNamePrefix="select"
              onChange={(selectedOptions) =>
                setFieldValue('branch', selectedOptions.map((option) => option.value))
              }
            />
            <ErrorMessage name="branch" component="div" className="error-message-custom" />
          </div>

          <div className="shortlist-checkbox-container-custom">
            <label>
              <Field type="checkbox" name="hasSkillCertificate" className="shortlist-checkbox-custom" />
              {' '}Has Skill Certificate
            </label>
          </div>

          <button type="submit" className="shortlist-submit-button-custom">Submit</button>
        </Form>
      )}
    </Formik>
  );
};

export default ShortListStudent;
