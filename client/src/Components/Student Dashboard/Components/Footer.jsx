import React from "react";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white py-5 text-center w-screen z-30">
			<div className="max-w-screen-xl mx-auto">
				<p>&copy; 2024 YCCE, Nagpur</p>
				<ul className="list-none p-0 mt-2">
					<li className="inline mx-2">
						<a
							href="/about"
							className="text-white no-underline hover:underline"
						>
							About Us
						</a>
					</li>
					<li className="inline mx-2">
						<a
							href="/contact"
							className="text-white no-underline hover:underline"
						>
							Contact
						</a>
					</li>
					<li className="inline mx-2">
						<a
							href="/privacy"
							className="text-white no-underline hover:underline"
						>
							Privacy Policy
						</a>
					</li>
					<li className="inline mx-2">
						<a
							href="/terms"
							className="text-white no-underline hover:underline"
						>
							Terms of Service
						</a>
					</li>
				</ul>
			</div>
		</footer>
	);
};

export default Footer;
