import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit, Trash2, Check, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Group {
	_id: string;
	name: string;
}

export default function ManageGroups() {
	const [groups, setGroups] = useState<Group[]>([]);
	const [newGroupName, setNewGroupName] = useState("");
	const [editingGroup, setEditingGroup] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		fetchGroups();
	}, []);

	const fetchGroups = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/groups");
			if (!response.ok) throw new Error("Failed to fetch groups.");
			const data = await response.json();
			setGroups(data);
		} catch (error) {
			toast.error("Failed to fetch groups.");
		}
	};

	const addGroup = async () => {
		if (!newGroupName) {
			toast.error("Group name is required.");
			return;
		}

		try {
			const response = await fetch("http://localhost:5000/api/group", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: newGroupName }),
			});
			if (!response.ok) throw new Error("Failed to add group.");
			toast.success("Group added successfully.");
			setNewGroupName("");
			fetchGroups();
		} catch (error) {
			toast.error("Failed to add group.");
		}
	};

	const deleteGroup = async (id: string) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/group/${id}`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) throw new Error("Failed to delete group.");
			toast.success("Group deleted successfully.");
			fetchGroups();
		} catch (error) {
			toast.error("Failed to delete group.");
		}
	};

	const updateGroup = async () => {
		if (!editingName) {
			toast.error("Group name is required.");
			return;
		}

		try {
			const response = await fetch("http://localhost:5000/api/group", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: editingGroup, name: editingName }),
			});
			if (!response.ok) throw new Error("Failed to update group.");
			toast.success("Group updated successfully.");
			setEditingGroup(null);
			setEditingName("");
			fetchGroups();
		} catch (error) {
			toast.error("Failed to update group.");
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
				<h1 className="text-3xl font-bold">Manage Groups</h1>
			</div>

			{/* Add New Group Form */}
			<div className="w-full max-w-md mb-8">
				<div className="flex items-center space-x-2">
					<input
						type="text"
						placeholder="Enter group name"
						value={newGroupName}
						onChange={(e) => setNewGroupName(e.target.value)}
						className="flex-1 px-4 py-2 border rounded-md"
					/>
					<button
						onClick={addGroup}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
					>
						Add Group
					</button>
				</div>
			</div>

			{/* Display Groups */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-11/12 max-w-4xl">
				{groups.map((group) => (
					<div
						key={group._id}
						className="bg-white shadow-md rounded-lg p-4 flex flex-col items-start space-y-2"
					>
						{editingGroup === group._id ? (
							<>
								<input
									type="text"
									value={editingName}
									onChange={(e) =>
										setEditingName(e.target.value)
									}
									className="w-full px-4 py-2 border rounded-md"
								/>
								<div className="flex space-x-2">
									<button
										onClick={updateGroup}
										className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
									>
										<Check className="w-4 h-4" />
									</button>
									<button
										onClick={() => {
											setEditingGroup(null);
											setEditingName("");
										}}
										className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
									>
										<X className="w-4 h-4" />
									</button>
								</div>
							</>
						) : (
							<>
								<h2 className="text-lg font-semibold">
									{group.name}
								</h2>
								<div className="flex space-x-2">
									<button
										onClick={() => {
											setEditingGroup(group._id);
											setEditingName(group.name);
										}}
										className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
									>
										<Edit className="w-4 h-4" />
									</button>
									<button
										onClick={() => deleteGroup(group._id)}
										className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
