import "./campuscard.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function CampusCard({ campus }) {
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

    const handleUpdateClick = (campusID) => {
        navigate(`/admin/update_campus`, { state: { campusID } });
    };

    const handleRoundClick = (campusID) => {
        navigate(`/admin/round`, { state: { campusID } });
    };

    return (
        <div className="card">
            <p className="price">{campus.campusName}</p>
            <h5 className="date">{convertDateFormat(campus.date)}</h5>
            <table className="tbl">
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Present</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {campus.rounds.map((round) => (
                        <tr key={round.roundID}>
                            <td>{round.roundName}</td>
                            <td>{round.presentCount}</td>
                            <td><Link to={`/admin/round_attendance/${round.roundID}`}>click here</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-group">
                <button onClick={() => handleRoundClick(campus.campusID)} className="btn archived-btn">Rounds</button>
                <button onClick={() => handleUpdateClick(campus.campusID)} className="btn update-btn">Update</button>
            </div>
        </div>
    );
}

export default CampusCard;
