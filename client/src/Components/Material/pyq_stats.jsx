import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constant.js';
import { useLocation } from 'react-router-dom';
import Loader from '../../loader/loader'; 

const SeenComponent = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { campusId, pyq } = location.state || {};
  const [pyqData, setPyqData] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading

  useEffect(() => {
    if (campusId && pyq) {
      fetchPyqData();
    }
  }, [campusId, pyq]);

  const fetchPyqData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${BACKEND_URL}/pyq/pyq_stats/${campusId}/${pyq}`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });
      console.log('API Response:', response.data);

      // Convert the response object into an array
      const dataArray = Object.entries(response.data).map(([branch, stats]) => ({
        branch,
        ...stats
      }));
      
      setPyqData(dataArray);
    } catch (error) {
      console.error('Error fetching PYQ data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const downloadPyqReport = async (branch, seenStatus) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(`${BACKEND_URL}/pyq/download_pyq_report`, {
        branch: branch,
        campusId: campusId,
        pyq: pyq,
        status: seenStatus
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${pyq}_${branch}_${seenStatus}_Report.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

    return (
      <>
      
        <div className="tl" id="vc">
          {loading ? (
            <Loader /> // Display loader when loading
          ) : (
            <table className="ctble">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Seen</th>
                  <th>Not Seen</th>
                  <th>Total</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {pyqData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.branch}</td>
                    <td>{data.seenCount}</td>
                    <td>{data.notSeenCount}</td>
                    <td>{data.totalStudents}</td>
                    <td>
                      <button onClick={() => downloadPyqReport(data.branch, 1)}>Download Seen</button>
                      <button onClick={() => downloadPyqReport(data.branch, 0)}>Download Not Seen</button>
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

export default SeenComponent;
