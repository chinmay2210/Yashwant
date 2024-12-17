import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = () => {
		// Clear student-related data from localStorage
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		// Redirect to the login page
		navigate('/student_login');
	};

	return (
		<nav className="p-4 fixed top-0 w-full z-30 backdrop-filter backdrop-blur-xl">
			<div className="flex justify-between items-center">
				<Link to="/" className="text-white text-2xl font-bold">
					Yeshwant
				</Link>
				<div className="hidden md:flex space-x-4 items-center">
					<button
						onClick={handleLogout}
						className="text-white bg-red-600 px-4 py-2 rounded-md"
					>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
