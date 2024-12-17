import React, { useState, useEffect } from 'react';
import "./student.css"
import { BACKEND_URL, BRANCHS } from '../../constant.js'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../loader/loader'; 

function ViewStudent() {
  const token = localStorage.getItem("token")
  const [branch, setBranch] = useState('');
  const [id, setId] = useState('');
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading

  useEffect(() => {
    // Fetch students data when component mounts or branch/id changes
    fetchStudents();
  }, [branch, id]);

  const fetchStudents = async () => {
    setLoading(true); // Start loading
    try {
      // Fetch students data from the server based on branch and id
      const response = await fetch(BACKEND_URL + `/student/?branch=${branch}&id=${id}`,{
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
      },
      });
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleUpdateClick = (student) => {
    navigate(`/admin/update_student`, { state: { student } });
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/student/delete/${id}`,{
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
      },
      });
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error.message);
    }
  };


    return (
      <>
     
        <div className="vs1">
          <form className="form" onSubmit={e => { e.preventDefault(); fetchStudents(); }}>
            <p className="title">View Students</p>
            <p className="message">Fill any or both of fields to get students</p>
            <div className="flex">
              <label>
                <select className="input" value={branch} onChange={e => setBranch(e.target.value)}>
                  <option value="">Select Branch</option>
                  {BRANCHS.map((branchItem, index) => (
                    <option key={index} value={branchItem}>{branchItem}</option>
                  ))}
                </select>
                <span>Branch</span>
              </label>
            </div>
            <label>
              <input className="input" type="number" placeholder="" value={id} onChange={e => setId(e.target.value)} />
              <span>ID</span>
            </label>
            <button className="submit">Submit</button>
          </form>
        </div>
  
        <div className='pagination'>
          {loading ? (
            <Loader /> // Show loader when loading
          ) : (
            students ? (
              <div className="tl" id="vc">
                <table className="ctble">
                  <thead>
                    <tr>
                      <th>Name of Student</th>
                      <th>Branch</th>
                      <th>Section</th>
                      <th>College ID</th>
                      <th>Avg. SGPA</th>
                      <th>Mobile</th>
                      <th>Personal Email Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id}>
                        <td>{student['Name of Student']}</td>
                        <td>{student.Branch}</td>
                        <td>{student.Section}</td>
                        <td>{student['College ID']}</td>
                        <td>{student['Avg. SGPA']}</td>
                        <td>{student['mobile']}</td>
                        <td>{student['Personal Email Address']}</td>
                        <td>
                          <button onClick={() => handleUpdateClick(student)}>Update</button>
                          <button onClick={() => handleDeleteClick(student.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No students found.</p>
            )
          )}
        </div>
      </>
    );
 

  
}

export default ViewStudent;
