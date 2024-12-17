import React, { useState } from "react";
import { Link } from "react-router-dom";
const TableSection = ({ title, data, headers, expandedData }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
			<h3 className="text-lg font-medium p-4 bg-gray-50 border-b">{title}</h3>
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
						{(isExpanded ? expandedData : data).map((row, index) => (
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
			{/* <div className="p-4 border-t">
				<button
					onClick={toggleExpand}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
				>
					{isExpanded ? "View Less" : "View More"}
				</button>
			</div>
			<div className="p-4 border-t">
				<button
					onClick={toggleExpand}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
				>
					View All
				</button>
			</div> */}
		</div>
	);
};

export default TableSection