import React, { useState } from "react";

import Sidebar from './Comp/Sidebar'
import ShortListStudent from "./Comp/Shortlist Student/ShortListStudent";
import HostEvent from "./Comp/HostEvent/HostEvent";
import EmployerRequestList from "./Comp/Shortlist Student/ViewShortlistedStudent";
const EmployerDashboard = () => {
	const [activeTab, setActiveTab] = useState("shortlist");

	return (
		<div className="flex h-full pt-20 bg-gray-100">
			{/* Sidebar */}
			<Sidebar></Sidebar>

			{/* Main Content */}
			<div className="flex-1 p-10 overflow-auto">
				<h1 className="text-3xl font-bold text-gray-800 mb-6">
					Employer Dashboard
				</h1>

				{/* Tab Navigation */}
				<div className="flex border-b border-gray-200 mb-6">
					<button
						className={`py-2 px-4 font-medium ${
							activeTab === "shortlist"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("shortlist")}
					>
						Create Job
					</button>
					
					<button
						className={`py-2 px-4 font-medium ${
							activeTab === "events"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("events")}
					>
						Host Events
					</button>
				</div>

				{/* Tab Content */}
				<div className="mt-6">
					{activeTab === "shortlist" && (
						<>
						<ShortListStudent></ShortListStudent>
						<EmployerRequestList/>
						</>
						
					)}
					{activeTab === "events" && (
						<HostEvent></HostEvent>
					)}
				</div>
			</div>
		</div>
	);
};

export default EmployerDashboard;
