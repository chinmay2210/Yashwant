import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constant.js';
import { useParams } from 'react-router-dom';
import Loader from '../../loader/loader'; 
import "./attendance.css"

const AttendanceTable = () => {
  const token = localStorage.getItem("token")
  const { roundID } = useParams();
  const [roundDetails, setRoundDetails] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${BACKEND_URL}/campus/round_att/${roundID}`,{
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
      },
      });
      const roundData = response.data.data;
      setRoundDetails(roundData.round[0]);
      setAttendanceData(roundData.attendance);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const downloadAttendanceReport = async (branch, attendanceStatus) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${BACKEND_URL}/attendance/download_attendance`, {
        branch: branch,
        roundid: roundID,
        roundname: roundDetails.RoundName,
        campusname: roundDetails.CampusName,
        attendanceStatus: attendanceStatus
      }, {
        headers: {
          'Authorization': token,  // Ensure this line is included
          'Content-Type': 'application/json',
        },
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${roundDetails.CampusName}_${roundDetails.RoundName}_${branch}_${attendanceStatus}_Attendance.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }



 

    return (
      <>
     
        <div className="tl" id="vc">
          <div className="attendance-details">
            <h2>Round: {roundDetails.RoundName}</h2>
            <h2>Round Date: {formatDate(roundDetails.RoundDate)}</h2>
            <h3>Campus: {roundDetails.CampusName}</h3>
            <h2>Campus Date: {formatDate(roundDetails.CampusDate)}</h2>
          </div>

        </div>
        <div className="tl" id="vc">
          {loading ? (
            <Loader /> // Display loader when loading
          ) : (
            <table className="ctble">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Branch</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Total</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((attendance, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{attendance.branch}</td>
                    <td>{attendance[0].present}</td>
                    <td>{attendance[0].absent}</td>
                    <td>{attendance[0].total}</td>
                    <td>
                      <button onClick={() => downloadAttendanceReport(attendance.branch, 'Present')}>Download Present</button>
                      <button onClick={() => downloadAttendanceReport(attendance.branch, 'Absent')}>Download Absent</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
 

};

export default AttendanceTable;
