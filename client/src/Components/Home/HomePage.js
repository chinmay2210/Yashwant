import React from "react";
import { Briefcase, Users, Building, Award, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const HomePage = () => {
	const stats = [
		{ icon: <Briefcase size={24} />, value: "500+", label: "Students Placed" },
		{ icon: <Users size={24} />, value: "100+", label: "Recruiting Companies" },
		{
			icon: <Building size={24} />,
			value: "20+",
			label: "Years of Excellence",
		},
		{ icon: <Award size={24} />, value: "₹24 LPA", label: "Highest Package" },
	];

	const quickLinks = [
		{ title: "Student Login", href: "/student_login" },
		{ title: "Employer Registration", href: "/employer_login" },
		{ title: "Placement Statistics", href: "/placement_statistics" },
		{ title: "Dean", href: "/dean" },
	];

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<header className="bg-blue-800 text-white p-8">
				<div className="container mx-auto px-4">
					<h1 className="text-3xl text-center font-bold">
						Yeshwantrao Chavan College of Engineering
					</h1>
				</div>
			</header>

			{/* About Section */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-6">
							About Training & Placement Cell
						</h2>
						<p className="text-gray-600 mb-8">
							The Training and Placement Cell at Yeshwantrao Chavan College of
							Engineering is dedicated to bridging the gap between academia and
							industry. We strive to provide our students with the best career
							opportunities while catering to the recruitment needs of top
							companies across various sectors.
						</p>
					</div>
				</div>
			</section>

			{/* Quick Links Section */}
			<section className="py-16 bg-gray-100">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">Quick Links</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{quickLinks.map((link, index) => (
							<NavLink
								key={index}
								to={link.href}
								className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
							>
								<h3 className="text-xl font-semibold mb-2">{link.title}</h3>
								<div className="flex items-center text-blue-600">
									More <ChevronRight size={20} className="ml-1" />
								</div>
							</NavLink>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<div key={index} className="text-center">
								<div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
									{stat.icon}
								</div>
								<h3 className="text-3xl font-bold text-blue-800 mb-2">
									{stat.value}
								</h3>
								<p className="text-gray-600">{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-800 text-white py-8">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="mb-4 md:mb-0">
							<h3 className="text-xl font-semibold">
								YCCE Training & Placement Cell
							</h3>
							<p>Hingna Road, Wanadongri, Nagpur - 441110</p>
						</div>
						<div>
							<a href="#" className="text-blue-400 hover:underline mr-4">
								Contact Us
							</a>
							<a href="#" className="text-blue-400 hover:underline">
								Privacy Policy
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default HomePage;
