import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, ShieldOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
	const [users, setUsers] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/users");
			if (!response.ok) throw new Error("Failed to fetch users.");
			const data = await response.json();
			setUsers(data);
		} catch (error) {
			toast.error("Failed to fetch users.");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/user/${id}`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) throw new Error("Failed to delete user.");
			toast.success("User deleted successfully.");
			fetchUsers();
		} catch (error) {
			toast.error("Failed to delete user.");
		}
	};

	const handleToggleBan = async (id: string) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/user/${id}`,
				{
					method: "PUT",
				}
			);
			if (!response.ok) throw new Error("Failed to update ban status.");
			toast.success("User ban status updated.");
			fetchUsers(); // Refresh the user list
		} catch (error) {
			toast.error("Failed to update ban status.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
			<div className="w-full max-w-4xl flex items-center justify-between mb-8">
				<button
					onClick={() => navigate(-1)} // Navigate back to the previous page
					className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
				>
					<ArrowLeft className="w-4 h-4" />
					<span>Back</span>
				</button>
				<h1 className="text-3xl font-bold">Manage Users</h1>
			</div>
			<div className="w-11/12 max-w-4xl">
				{users.length === 0 ? (
					<p className="text-gray-500 text-center">
						No users available.
					</p>
				) : (
					<div className="bg-white shadow-md rounded-lg">
						<table className="min-w-full border-collapse">
							<thead>
								<tr>
									<th className="border-b p-4 text-left text-gray-700 font-semibold">
										Name
									</th>
									<th className="border-b p-4 text-left text-gray-700 font-semibold">
										Email
									</th>
									<th className="border-b p-4 text-left text-gray-700 font-semibold">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user: any) => (
									<tr key={user._id}>
										<td className="border-b p-4">
											{user.name}
										</td>
										<td className="border-b p-4">
											{user.email}
										</td>
										<td className="border-b p-4 flex space-x-4">
											<button
												onClick={() =>
													handleToggleBan(user._id)
												}
												className={`px-4 py-2 rounded-md flex items-center ${
													user.isBanned
														? "bg-green-500 text-white"
														: "bg-red-500 text-white"
												} hover:opacity-90 transition`}
											>
												<ShieldOff className="w-4 h-4 mr-2" />
												{user.isBanned
													? "Unban"
													: "Ban"}
											</button>
											<button
												onClick={() =>
													handleDelete(user._id)
												}
												className="px-4 py-2 bg-gray-500 text-white rounded-md flex items-center hover:bg-gray-600 transition"
											>
												<Trash2 className="w-4 h-4 mr-2" />
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
