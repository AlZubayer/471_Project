import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Smile, Frown, Meh } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function NewPost() {
	const [groups, setGroups] = useState([]);
	const { user } = useAuth();
	const [formData, setFormData] = useState({
		group: "",
		title: "",
		content: "",
		isAnonymous: false,
		avatar: "1",
		nickname: "",
		user: user?.id,
	});
	const navigate = useNavigate();

	useEffect(() => {
		fetchGroups();
	}, []);

	const fetchGroups = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/groups");
			if (!response.ok) throw new Error("Failed to fetch groups");
			const data = await response.json();
			setGroups(data);
		} catch (error) {
			toast.error("Failed to fetch groups.");
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value, type } = e.target as HTMLInputElement;
		const checked = (e.target as HTMLInputElement).checked;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.group || !formData.title || !formData.content) {
			toast.error("Group, title, and content are required.");
			return;
		}

		if (formData.isAnonymous && (!formData.nickname || !formData.avatar)) {
			toast.error(
				"Nickname and avatar are required for anonymous posts."
			);
			return;
		}

		try {
			const response = await fetch("http://localhost:5000/api/post", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (!response.ok) throw new Error("Failed to add post");
			toast.success("Post added successfully!");
			setFormData({
				group: "",
				title: "",
				content: "",
				isAnonymous: false,
				avatar: "1",
				nickname: "",
				user: user?.id,
			});
			navigate("/");
		} catch (error) {
			toast.error("Failed to add post.");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
			<h1 className="text-3xl font-bold mb-6">Add New Post</h1>
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
			>
				<div className="mb-4">
					<label
						htmlFor="group"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Select Group
					</label>
					<select
						title="group"
						name="group"
						value={formData.group}
						onChange={handleInputChange}
						className="w-full px-4 py-2 border rounded-md"
					>
						<option value="">-- Select a Group --</option>
						{groups.map((group: any) => (
							<option key={group._id} value={group._id}>
								{group.name}
							</option>
						))}
					</select>
				</div>

				<div className="mb-4">
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Title
					</label>
					<input
						title="title"
						type="text"
						name="title"
						value={formData.title}
						onChange={handleInputChange}
						className="w-full px-4 py-2 border rounded-md"
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="content"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Content
					</label>
					<textarea
						title="content"
						name="content"
						value={formData.content}
						onChange={handleInputChange}
						rows={5}
						className="w-full px-4 py-2 border rounded-md"
					></textarea>
				</div>

				<div className="mb-4">
					<label
						htmlFor="isAnonymous"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Post Anonymously
					</label>
					<input
						title="isAnonymous"
						type="checkbox"
						name="isAnonymous"
						checked={formData.isAnonymous}
						onChange={handleInputChange}
						className="h-5 w-5"
					/>
				</div>

				{formData.isAnonymous && (
					<>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Select Avatar
							</label>
							<div className="flex space-x-4">
								{["1", "2", "3"].map((avatar) => (
									<button
										type="button"
										key={avatar}
										onClick={() =>
											setFormData({ ...formData, avatar })
										}
										className={`p-2 rounded-md border ${
											formData.avatar === avatar
												? "border-blue-500"
												: "border-gray-300"
										}`}
									>
										{avatar === "1" && (
											<Smile className="w-6 h-6 text-yellow-500" />
										)}
										{avatar === "2" && (
											<Frown className="w-6 h-6 text-red-500" />
										)}
										{avatar === "3" && (
											<Meh className="w-6 h-6 text-green-500" />
										)}
									</button>
								))}
							</div>
						</div>

						<div className="mb-4">
							<label
								htmlFor="nickname"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Nickname
							</label>
							<input
								title="nickname"
								type="text"
								name="nickname"
								value={formData.nickname}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border rounded-md"
							/>
						</div>
					</>
				)}

				<button
					type="submit"
					className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
				>
					Add Post
				</button>
			</form>
		</div>
	);
}
