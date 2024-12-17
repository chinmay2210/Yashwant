import { useEffect, useState } from "react";
import axios from 'axios'
import { BACKEND_URL } from '../../constant'

import React from "react";
import { Link } from "react-router-dom";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Label,
} from "recharts";
import Loader from "../../loader/loader";
import CampusBranchOverview from "./BranchWisePlacement/BranchWisePlacement";

// Sample data - replace with your actual data


const DashboardCard = ({ title, value }) => (
	<div className="bg-white p-4 rounded-lg shadow">
		<h3 className="text-sm font-medium text-gray-500">{title}</h3>
		<p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
	</div>
);

const TableSection = ({ title, data, headers, view_more }) => (
	<div className="mt-6 bg-white rounded-lg shadow">
		<h3 className="text-lg font-medium p-4 border-b">{title}</h3>
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						{headers.map((header, index) => (
							<th
								key={index}
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{data.map((row, index) => (
						<tr key={index}>
							{Object.values(row).map((cell, cellIndex) => (
								<td
									key={cellIndex}
									className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
								>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
		<div className="p-4 border-t">
			<Link to={view_more}><button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
				View More
			</button></Link>

		</div>
	</div>
);

const StatsDashboard = () => {
	const [loading, setLoading] = useState(true);
	const [chartData, setChartData] = useState({});
	const [error, setError] = useState(null); // To handle errors

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(`${BACKEND_URL}/stats`, {
					headers: {
						'Authorization': token,
						'Content-Type': 'application/json',
					},
				});

				const data = response.data;
				setChartData(data);
			
			} catch (err) {
				console.error("Error fetching stats:", err);
				setError(err.message || 'An error occurred while fetching data');
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return (
			<div className="p-4 w-[95%] mx-auto">
				<h1 className="text-2xl font-bold mb-6">Stats Dashboard</h1>
				<div className="text-red-500">Error: {error}</div>
			</div>
		);
	}

	// Calculate values for the PieChart
	const placed = chartData.totalPlacedStudents || 0;
	const notEligible = chartData.totalNotEligibleStudents; 
	const notPlaced =  chartData.totalStudents- chartData.totalPlacedStudents-chartData.totalNotEligibleStudents; 

	const pieData = [
		{ name: "Placed", value: placed, color: "#70e000" },
		{ name: "Remaining", value: notPlaced, color: "#ffc300" },
		{ name: "Not Eligible", value: notEligible, color: "#c1121f" },

	];

	return (
		<div className="bg-gray-100 min-h-screen">
			<div className="p-4 w-[95%] mx-auto">
				<h1 className="text-2xl font-bold mb-6">Stats Dashboard</h1>

				{/* Overview Cards and PieChart */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* PieChart for Placement Status */}
					<div className="bg-white p-4 rounded-lg shadow">
						<h2 className="text-lg font-medium mb-4">Placement Status</h2>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={pieData}
									cx="50%"
									cy="50%"
									labelLine={false}
									outerRadius={150}
									dataKey="value"
									label={({ name, value }) => `${name}: ${value}`}
								>
									{pieData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
									<Label
										value={`Total Students: ${chartData.totalStudents || 0}`}
										position="center"
										fill="#000"
										style={{ fontSize: "16px", fontWeight: "bold" }}
									/>
								</Pie>
							</PieChart>
						</ResponsiveContainer>
						<div className="w-40 p-2 bg-gray-100 rounded-lg mt-4">
							{pieData.map((entry, index) => (
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

					{/* Dashboard Cards */}
					<div className="space-y-5">
						<DashboardCard title="Total Campuses" value={chartData.totalCampus} />
						<DashboardCard title="Total Ongoing Campuses" value={chartData.totalOngoingCampus} />
						<DashboardCard title="Total Completed Campuses" value={chartData.totalCampus - chartData.totalOngoingCampus} />
						<DashboardCard title="Total Placed Students" value={chartData.totalPlacedStudents} />
						<Link to="/admin/campus-overview">
							<button className="bg-green-600 p-4 my-4 rounded-lg shadow text-white">
								Campus Overview
							</button>
						</Link>
					</div>

				</div>

				{/* Tables Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
					{/* Recent Ongoing Campuses */}
					<TableSection
						title="Recent Ongoing Campuses"
						headers={["Campus", "Date", "Eligible Students"]}
						data={
							chartData.recentOngoingCampus && chartData.recentOngoingCampus.length > 0
								? chartData.recentOngoingCampus.map(campus => ({
									campus: campus.CampusName,
									date: new Date(campus.Date).toLocaleDateString(),
									eligibleStudents: campus.eligibleStudents,
								}))
								: [
									{
										campus: "No ongoing campuses",
										date: "-",
										eligibleStudents: "-",
									},
								]
						}
						view_more={"/admin/campus"}
					/>

					{/* Recent Completed Campuses */}
					<TableSection
						title="Recent Completed Campuses"
						headers={["Campus", "Date", "Eligible Students", "Placed Students"]}
						data={
							chartData.recentCompletedCampus && chartData.recentCompletedCampus.length > 0
								? chartData.recentCompletedCampus.map(campus => ({
									campus: campus.CampusName,
									date: new Date(campus.Date).toLocaleDateString(),
									eligibleStudents: campus.eligibleStudents,
									placedStudents: campus.placedStudents,
								}))
								: [
									{
										campus: "No completed campuses",
										date: "-",
										eligibleStudents: "-",
										placedStudents: "-",
									},
								]
						}
						view_more={"/admin/all_campus_overview"}
					/>
				</div>
				<CampusBranchOverview />

				<TableSection
					title="Employees Request"
					headers={["Employer Name", "Email", "Status"]}
					data={
						chartData.recentEmployerRequest && chartData.recentEmployerRequest.length > 0
							? chartData.recentEmployerRequest.map(request => ({
								employerName: request.employerName,
								email: request.employerEmail,
								status: request.status,
							}))
							: [
								{
									employerName: "No recent employer requests",
									email: "-",
									status: "-",
								},
							]
					}
					view_more="/admin/employers"
				/>


				<TableSection
					title="Jobs Published by Employers"
					headers={["Employer Name", "Skill", "Skill Level", "Job Count"]}
					data={
						chartData.recentJobEmployerRequest && chartData.recentJobEmployerRequest.length > 0
							? chartData.recentJobEmployerRequest.map(job => ({
								employerID: job.employerName,
								skill: job.skill,
								skillLevel: job.skillLevel,
								status: job.jobCount,
							}))
							: [
								{
									employerID: "No recent job postings",
									skill: "-",
									status: "-",
								},
							]
					}
					view_more="/admin/jobs"
				/>
			</div>
		</div>
	);
};


export default StatsDashboard;
