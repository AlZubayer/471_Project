import React, { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:5000/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			if (response.ok) {
				login({
					id: data.user._id,
					name: data.user.name,
					email: data.user.email,
					userType: data.user.userType,
				});
				toast.success("Login successful!");
				navigate("/");
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error("Login failed. Please check your credentials.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
				<h2 className="text-2xl font-semibold text-center mb-6">
					Login
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="relative">
						<Mail className="absolute top-3 left-3 text-gray-400" />
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={formData.email}
							onChange={handleInputChange}
							className="w-full pl-10 py-2 border rounded-md"
						/>
					</div>
					<div className="relative">
						<Lock className="absolute top-3 left-3 text-gray-400" />
						<input
							type="password"
							name="password"
							placeholder="Password"
							value={formData.password}
							onChange={handleInputChange}
							className="w-full pl-10 py-2 border rounded-md"
						/>
					</div>
					<button
						type="submit"
						className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
