import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Navbar: React.FC = () => {
	const { user, logout } = useAuth();

	return (
		<nav className="bg-gray-100 text-gray-800 shadow-md">
			<div className="container mx-auto px-4 py-2 flex justify-between items-center">
				<div className="text-lg font-semibold">
					<Link to="/" className="hover:text-blue-500 transition">
						CareCircle
					</Link>
				</div>

				<div className="flex items-center space-x-4">
					{!user ? (
						<>
							<Link
								to="/login"
								className="px-4 py-2 rounded-md hover:bg-gray-200 transition"
							>
								Login
							</Link>
							<Link
								to="/signup"
								className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
							>
								Signup
							</Link>
						</>
					) : (
						<>
							{user.userType === "admin" && (
								<Link
									to="/admin"
									className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
								>
									Admin Dashboard
								</Link>
							)}
							<button
								onClick={logout}
								className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
							>
								Logout
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
