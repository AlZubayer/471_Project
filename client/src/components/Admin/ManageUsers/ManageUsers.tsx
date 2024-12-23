import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, ShieldOff, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
	const [users, setUsers] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
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
			setFilteredUsers(data);
		} catch (error) {
			toast.error("Failed to fetch users.");
		}
	};

	const handleSearch = async () => {
		if (!searchText.trim()) {
			setFilteredUsers(users);
			return;
		}
		try {
			const response = await fetch(
				"http://localhost:5000/api/searchUsers",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ query: searchText }),
				}
			);
			if (!response.ok) throw new Error("Failed to search users.");
			const data = await response.json();
			setFilteredUsers(data);
		} catch (error) {
			toast.error("Failed to search users.");
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
			fetchUsers();
		} catch (error) {
			toast.error("Failed to update ban status.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
			<div className="w-full max-w-4xl flex items-center justify-between mb-6">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
				>
					<ArrowLeft className="w-5 h-5" />
					<span>Back</span>
				</button>
				<h1 className="text-3xl font-bold text-gray-800">
					Manage Users
				</h1>
			</div>
			<div className="w-full max-w-4xl mb-4">
				<div className="flex items-center space-x-2">
					<input
						type="text"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="Search users by name or email"
						className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
					<button
						onClick={handleSearch}
						className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
					>
						<Search className="w-5 h-5 mr-2" />
						Search
					</button>
				</div>
			</div>
			<div className="w-11/12 max-w-4xl">
				{filteredUsers.length === 0 ? (
					<p className="text-gray-500 text-center">
						No users found. Try searching with different criteria.
					</p>
				) : (
					<div className="bg-white shadow-lg rounded-lg">
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
								{filteredUsers.map((user: any) => (
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
