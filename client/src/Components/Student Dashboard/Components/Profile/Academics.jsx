import React, { useEffect, useState } from "react";
import Loader from "../../../../loader/loader";

const Academics = () => {
	const [details, setDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// Retrieve the user data from localStorage
		const userData = localStorage.getItem('user');
		
		// If user data is found, parse it
		if (userData) {
			const parsedData = JSON.parse(userData);

			// Set the parsed data to state
			setDetails({
				ssc: {
					year: parsedData["SSC YOP"],
					score: parseFloat(parsedData["SSC %age"]),
				},
				hsc: {
					year: parsedData["HSC YoP"],
					score: parseFloat(parsedData["HSSC %age"]),
				},
				sgpa: [
					parseFloat(parsedData["SGPA1"]),
					parseFloat(parsedData["SGPA2"]),
					parseFloat(parsedData["SGPA3"]),
					parseFloat(parsedData["SGPA4"]),
					parseFloat(parsedData["SGPA5"]),
					parseFloat(parsedData["SGPA6"]),
					parseFloat(parsedData["SGPA7"]),
				],
			});
		}

		// Simulate loading time
		
	}, []);

	if (isLoading) return <Loader />;

	if (!details) return <div>No data available.</div>;

	return (
		<div className="p-8 bg-gray-100">
			<h1 className="text-3xl font-bold mb-6 text-blue-600">
				Academic Details
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* SSC Details */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-bold mb-4 text-blue-500">
						SSC Details
					</h2>
					<p className="text-gray-700">
						<strong>Year:</strong> {details.ssc.year}
					</p>
					<p className="text-gray-700">
						<strong>Score:</strong> {details.ssc.score}%
					</p>
				</div>

				{/* HSC Details */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-bold mb-4 text-blue-500">
						HSC Details
					</h2>
					<p className="text-gray-700">
						<strong>Year:</strong> {details.hsc.year}
					</p>
					<p className="text-gray-700">
						<strong>Score:</strong> {details.hsc.score}%
					</p>
				</div>

				{/* SGPA Details */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-bold mb-4 text-blue-500">
						SGPA Details
					</h2>
					<ul className="list-disc list-inside text-gray-700">
						{details.sgpa.map((sgpaScore, sgpaIndex) => (
							<li key={sgpaIndex}>
								Semester {sgpaIndex + 1}: {sgpaScore}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Academics;
