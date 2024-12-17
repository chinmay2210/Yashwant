import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import TableSection from '../Table';
import { BACKEND_URL } from "../../../constant";

// DashboardCard Component
const DashboardCard = ({ title, value }) => (
	<div className="bg-white p-4 rounded-lg shadow">
		<h3 className="text-sm font-medium text-gray-500">{title}</h3>
		<p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
	</div>
);

const BranchStats = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { branchName } = location.state || {};
	const [studentData, setStudentData] = useState([]);
	const [totalStudent, setTotalStudent] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [studentBranchData, setStudentBranchData] = useState([]);
	const [placementStatus, setPlacementStatus] = useState('All');
	const [collegeId, setCollegeId] = useState('');
	const [filteredTableData, setFilteredTableData] = useState([]); // State for filtered table data

	useEffect(() => {
		const fetchData = async () => {
			if (!branchName) return;

			try {
				const token = localStorage.getItem("token");
				const response = await axios.post(BACKEND_URL + '/stats/get_branch_stats', {
					branch: branchName,
				}, {
					headers: {
						'Authorization': `${token}`,
						'Content-Type': 'application/json',
					},
				});
				const data = response.data;
				const formattedData = [
					{ name: "Placed", value: data.studentStats.Placed, color: "#70e000" },
					{ name: "Eligible", value: data.studentStats.Eligible, color: "#00b4d8" },
					{ name: "Higher Studies", value: data.studentStats.HigherStudies, color: "#ff8fab" },
					{ name: "Opted for placement", value: data.studentStats.PlacementFacility, color: "#ffc300" },
					{ name: "Not Eligible", value: data.studentStats.NotEligible, color: "#c1121f" },
				];
				setTotalStudent(data.total);
				setStudentData(formattedData);
				setStudentBranchData(data.studentData);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [branchName]); // Removed filters from the dependency array to avoid fetching data unnecessarily

	useEffect(() => {
		// Filter studentBranchData based on selected filters
		const filteredData = studentBranchData.filter(item => {
			const matchesPlacementStatus = 
				placementStatus === 'All' || item.placementStatus === placementStatus;
			const matchesCollegeId = !collegeId || item.collegeId.toString() === collegeId;

			return matchesPlacementStatus && matchesCollegeId;
		});

		const formattedTableData = filteredData.map(item => ({
			'Student name': item['studentName'],
			"College ID": item['collegeId'],
			'Placement Status': item['placementStatus'],
			'No of Offer': item['noOfOffers'],
			"View Profile": (
				<button
					onClick={() => handleClick(item.viewProfile)}
					className="text-blue-500 hover:underline"
				>
					Profile
				</button>
			),
			"View Resume": (
				<button
					onClick={() => resume(item.viewProfile)}
					className="text-blue-500 hover:underline"
				>
					Resume
				</button>
			)
		}));

		setFilteredTableData(formattedTableData); // Update the filtered table data
	}, [studentBranchData, placementStatus, collegeId]); // Filter whenever these change

	const resume = (id) => {
		navigate(`/admin/resume?studentID=${id}`);
	};

	const handleClick = (id) => {
		navigate(`/admin/update_student`, { state: { id } });
	};

	const handleFilterSubmit = () => {
		// Trigger filtering on submit if needed
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className="p-4 bg-gray-100 w-[95%] mx-auto">
			<h1 className="text-2xl font-bold mb-6">Stats Dashboard for {branchName}</h1>

			
			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-1 md:col-span-2 bg-white p-4 rounded-lg shadow">
					<h2 className="text-lg font-medium mb-4">{branchName} Student Status</h2>
					<ResponsiveContainer width="100%" height={400}>
						<PieChart>
							<Pie
								data={studentData}
								cx="50%"
								cy="50%"
								labelLine={false}
								outerRadius={150}
								fill="#8884d8"
								dataKey="value"
								label={({ name, value }) => `${name}: ${value}`}
							>
								{studentData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
								<Label
									value={`Total Students: ${totalStudent}`}
									position="center"
									fill="#000"
									style={{ fontSize: "16px", fontWeight: "bold" }}
								/>
							</Pie>
						</PieChart>
					</ResponsiveContainer>
					<div className="flex justify-center space-x-4 mt-4">
						<div className="w-60 p-2 bg-gray-100 rounded-lg mt-4">
							{studentData.map((entry, index) => (
								<div key={`legend-${index}`} className="flex items-center mb-2">
									<div
										className="w-3 h-3 mr-2"
										style={{ backgroundColor: entry.color }}
									></div>
									<span>{entry.name}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="space-y-5">
					{studentData.map((data, index) => (
						<DashboardCard title={data.name} value={data.value} key={index} />
					))}
				</div>
			</div>

						{/* Filter Section */}
			<div className="flex mb-4 space-x-4 mt-10">
				<select
					value={placementStatus}
					onChange={(e) => setPlacementStatus(e.target.value)}
					className="p-2 border rounded"
				>
					<option value="All">All Students</option>
					<option value="Placed">Placed</option>
					<option value="Not Placed">Not Placed</option>
				</select>
				<input
					type="text"
					placeholder="Enter College ID"
					value={collegeId}
					onChange={(e) => setCollegeId(e.target.value)}
					className="p-2 border rounded"
				/>
				<button onClick={handleFilterSubmit} className="p-2 bg-blue-500 text-white rounded">Filter</button>
			</div>

			<TableSection
				title="Student Data"
				headers={["Student name", "College ID", "Placement Status", "No of Offer", "Profile", "Resume"]}
				data={filteredTableData} // Use filtered data here
			/>

		</div>
	);
};

export default BranchStats;
