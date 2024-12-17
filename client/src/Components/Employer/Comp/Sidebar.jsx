import { User, Briefcase, Users, Calendar, Search, X } from "lucide-react";

function Sidebar() {
    
    const companyInfo = {
		name: "TechCorp",
		industry: "Information Technology",
		employees: "1000-5000",
		location: "Silicon Valley",
	};


    return (
        <div className="w-64 bg-white shadow-md">
				<div className="p-6">
					<h2 className="text-2xl font-semibold text-gray-800">
						{companyInfo.name}
					</h2>
					<div className="mt-4">
						<p className="grid text-gray-600 mb-2">
							<Briefcase size={18} className="mr-2" /> {companyInfo.industry}
						</p>
						<p className="grid text-gray-600 mb-2">
							<Users size={18} className="mr-2" /> {companyInfo.employees}{" "}
							employees
						</p>
						<p className="grid text-gray-600">
							<User size={18} className="mr-2" /> {companyInfo.location}
						</p>
						<button className="p-2 my-4 bg-orange-300 text-lg flex">
							Logout
						</button>
					</div>
				</div>
			</div>
    )
}


export default Sidebar;