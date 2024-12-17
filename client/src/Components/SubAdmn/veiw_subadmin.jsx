import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../constant';
import { useNavigate } from 'react-router-dom';
import Loader from '../../loader/loader'; 

function ViewSubAdmin() {
    const token = localStorage.getItem("token")
    const [SubAdmins, setSubAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubAdmins = async () => {
            try {
                const response = await axios.get(BACKEND_URL + '/subadmin',{
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                });
                if (Array.isArray(response.data.SubAdmin)) {
                    setSubAdmins(response.data.SubAdmin);
                } else {
                    setError('Data format error: Expected an array');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchSubAdmins();
    }, []);

    const handleUpdateClick = (SubAdmin) => {
        navigate(`/admin/update_SubAdmin`, { state: { SubAdmin } },{
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        });
    };

    const handleDeleteClick = async (sID) => {
        try {
            await axios.delete(`${BACKEND_URL}/subadmin/delete/${sID}`,{
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            setSubAdmins(SubAdmins.filter(SubAdmin => SubAdmin.sID !== sID));
        } catch (error) {
            console.error('Error deleting SubAdmin:', error.message);
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
                            {SubAdmins.map((SubAdmin, index) => (
                                <tr key={SubAdmin.sID}>
                                    <td>{index + 1}</td>
                                    <td>{SubAdmin.name}</td>
                                    <td>{SubAdmin.id}</td>
                                    <td>{SubAdmin.password}</td>
                                    <td>
                                        <button onClick={() => handleUpdateClick(SubAdmin)}>Update</button>
                                        <br />
                                        <button onClick={() => handleDeleteClick(SubAdmin.sID)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    
   
}

export default ViewSubAdmin;
