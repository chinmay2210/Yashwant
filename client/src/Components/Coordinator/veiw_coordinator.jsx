import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './coordinator.css';
import { BACKEND_URL } from '../../constant';
import { useNavigate } from 'react-router-dom';
import Loader from '../../loader/loader'; 

function ViewCoordinator() {
    const token = localStorage.getItem("token")
    const [coordinators, setCoordinators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoordinators = async () => {
            try {
                const response = await axios.get(BACKEND_URL + '/coordinator',{
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
                if (Array.isArray(response.data.coordinator)) {
                    setCoordinators(response.data.coordinator);
                } else {
                    setError('Data format error: Expected an array');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchCoordinators();
    }, []);

    const handleUpdateClick = (coordinator) => {
        navigate(`/admin/update_coordinator`, { state: { coordinator } },{
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        });
    };

    const handleDeleteClick = async (cID) => {
        try {
            await axios.delete(`${BACKEND_URL}/coordinator/delete/${cID}`,{
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            setCoordinators(coordinators.filter(coordinator => coordinator.cID !== cID));
        } catch (error) {
            console.error('Error deleting coordinator:', error.message);
        }
    };

    if (loading) {
        return <Loader />; // Display loader while fetching data
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

   
        return (
            <>
                <div className="tl" id="vc">
                    <table className="ctble">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Name</th>
                                <th>Login ID</th>
                                <th>Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coordinators.map((coordinator, index) => (
                                <tr key={coordinator.cID}>
                                    <td>{index + 1}</td>
                                    <td>{coordinator.name}</td>
                                    <td>{coordinator.id}</td>
                                    <td>{coordinator.password}</td>
                                    <td>
                                        <button onClick={() => handleUpdateClick(coordinator)}>Update</button>
                                        <br />
                                        <button onClick={() => handleDeleteClick(coordinator.cID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
   
}

export default ViewCoordinator;
