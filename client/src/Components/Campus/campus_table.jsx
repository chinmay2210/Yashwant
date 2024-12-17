import "./camps_table.css";
import { useNavigate } from 'react-router-dom';

function CampusTable({ campuses }) {
    const navigate = useNavigate();

    function convertDateFormat(inputDate) {
        // Create a new Date object from the input date
        const date = new Date(inputDate);
        if (isNaN(date.getTime())) {
            // Handle the case where the date is invalid
            console.error('Invalid date:', inputDate);
            return 'Invalid Date';
        }
        // Format the date
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date).replace(/\s/g, '-');
    }

    const handleRoundClick = (campusID) => {
        navigate(`/admin/round`, { state: { campusID } });
    };

    const handleUpdateClick = (campusID) => {
        navigate(`/admin/update_campus`, { state: { campusID } });
    };

    return (
        <table className="ctble">
            <thead>
                <tr>
                    <th>Sr. No.</th>
                    <th>Campus Name</th>
                    <th>Date</th>
                    <th>Package</th>
                    <th>View</th>
                    <th>Update</th>
                </tr>
            </thead>
            <tbody>
                {campuses.map((campus, index) => (
                    <tr key={campus.campusID}>
                        <td>{index + 1}</td>
                        <td>{campus.campusName}</td>
                        <td>{convertDateFormat(campus.date)}</td>
                        <td>{campus.package}</td>
                        <td><button onClick={() => handleRoundClick(campus.campusID)}>Rounds</button></td>
                        <td><button onClick={() => handleUpdateClick(campus.campusID)}>Update</button></td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default CampusTable;
