import { useState, useEffect } from "react";
import {
	Search,
	Smile,
	Frown,
	Meh,
	ArrowUp,
	MessageCircle,
	X,
	MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";

interface Post {
	_id: string;
	group: { _id: string; name: string };
	user?: { _id: string; name: string; email: string };
	isAnonymous: boolean;
	avatar: string | null;
	nickname: string | null;
	title: string;
	content: string;
	createdAt: string;
	upvotedBy: string[];
}

interface Group {
	_id: string;
	name: string;
}

export default function Home() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [groups, setGroups] = useState<Group[]>([]);
	const [searchText, setSearchText] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");
	const [menuOpen, setMenuOpen] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentModalPost, setCurrentModalPost] = useState<Post | null>(null);
	const { user } = useAuth();

	useEffect(() => {
		fetchGroups();
		fetchPosts();
	}, []);

	useEffect(() => {
		fetchPosts();
	}, [selectedGroup]);

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

	const fetchPosts = async () => {
		try {
			const body = {
				group: selectedGroup || undefined,
				searchText: searchText || undefined,
			};
			const response = await fetch("http://localhost:5000/api/getPosts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!response.ok) throw new Error("Failed to fetch posts");
			const data = await response.json();
			setPosts(data.posts);
		} catch (error) {
			toast.error("Failed to fetch posts.");
		}
	};

	const handleSearch = () => {
		fetchPosts();
	};

	const handleUpvote = async (postId: string) => {
		if (!user) {
			toast.error("You need to be logged in to upvote.");
			return;
		}

		const post = posts.find((post) => post._id === postId);

		if (post?.upvotedBy.some((id) => id === user.id)) {
			toast.error("You have already upvoted this post.");
			return;
		}

		try {
			const body = {
				user: user.id,
				postId,
			};
			const response = await fetch(
				"http://localhost:5000/api/post/upvote",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
				}
			);
			if (!response.ok) throw new Error("Failed to upvote post");

			toast.success("Upvote added!");
			fetchPosts();
		} catch (error) {
			toast.error("Failed to add upvote.");
		}
	};

	const handleDelete = async (postId: string) => {
		try {
			const response = await fetch(`http://localhost:5000/api/post`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ postId }),
			});
			if (!response.ok) throw new Error("Failed to delete post");
			toast.success("Post deleted successfully");
			fetchPosts();
		} catch (error) {
			toast.error("Failed to delete post.");
		}
	};

	const openModal = (post: Post) => {
		setCurrentModalPost(post);
		setIsModalOpen(true);
	};

	return (
		<div className="min-h-screen py-10 px-4 bg-gray-50">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
					Community Posts
				</h1>

				<div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
					<div className="flex items-center w-full md:w-auto">
						<input
							type="text"
							placeholder="Search posts..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							className="w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							title="search"
							onClick={handleSearch}
							className="ml-2 px-5 py-3 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition"
						>
							<Search className="w-5 h-5" />
						</button>
					</div>
					<select
						title="group"
						value={selectedGroup}
						onChange={(e) => setSelectedGroup(e.target.value)}
						className="px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">All Groups</option>
						{groups.map((group) => (
							<option key={group._id} value={group._id}>
								{group.name}
							</option>
						))}
					</select>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{posts.length === 0 ? (
						<p className="col-span-full text-center text-gray-500">
							No posts available.
						</p>
					) : (
						posts.map((post) => (
							<div
								key={post._id}
								className="bg-white shadow-lg rounded-lg p-6 flex flex-col border hover:shadow-xl transition-shadow relative"
							>
								<div className="absolute top-4 right-4">
									<button
										title="more"
										onClick={() =>
											setMenuOpen(
												menuOpen === post._id
													? null
													: post._id
											)
										}
									>
										<MoreHorizontal className="w-5 h-5 text-gray-600 hover:text-gray-800" />
									</button>
									{menuOpen === post._id && (
										<div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-10">
											{post.user?._id === user?.id ? (
												<button
													onClick={() =>
														handleDelete(post._id)
													}
													className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
												>
													Delete
												</button>
											) : (
												<Link
													to={`/report/${post._id}`}
													className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
												>
													Report
												</Link>
											)}
										</div>
									)}
								</div>

								<h2 className="text-xl font-bold text-gray-800 mb-3">
									{post.title}
								</h2>

								<div className="flex items-center text-gray-500 mb-4 space-x-2">
									{post.isAnonymous ? (
										<>
											<span>Anonymous</span>
											{post.avatar === "1" && (
												<Smile className="w-5 h-5 text-yellow-500" />
											)}
											{post.avatar === "2" && (
												<Frown className="w-5 h-5 text-red-500" />
											)}
											{post.avatar === "3" && (
												<Meh className="w-5 h-5 text-green-500" />
											)}
										</>
									) : (
										<span className="text-gray-700 font-medium">
											{post.user?.name}
										</span>
									)}
								</div>

								<p className="text-gray-600 mb-4 leading-relaxed">
									{post.content.length > 100
										? `${post.content.substring(0, 100)}...`
										: post.content}
								</p>

								<div className="flex justify-between items-center text-gray-400 text-sm mt-auto pt-4 border-t">
									<div className="flex items-center space-x-3">
										<button
											onClick={() =>
												handleUpvote(post._id)
											}
											className={`flex items-center space-x-1 ${
												post.upvotedBy.includes(
													user?.id ?? ""
												)
													? "text-green-600 hover:text-green-700"
													: "text-gray-600 hover:text-gray-800"
											}`}
										>
											<ArrowUp
												className={`w-5 h-5 ${
													post.upvotedBy.includes(
														user?.id ?? ""
													)
														? "text-green-600"
														: "text-gray-600"
												}`}
											/>
											<span>{post.upvotedBy.length}</span>
										</button>
										<button
											onClick={() => openModal(post)}
											className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
										>
											<MessageCircle className="w-5 h-5" />
											<span>Comments</span>
										</button>
									</div>
									<span>
										{new Date(
											post.createdAt
										).toLocaleDateString()}
									</span>
								</div>
							</div>
						))
					)}
				</div>

				{isModalOpen && currentModalPost && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
						<div className="bg-white p-6 rounded-lg shadow-lg w-96">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-xl font-bold">Comments</h3>
								<button
									title="close"
									onClick={() => setIsModalOpen(false)}
								>
									<X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
								</button>
							</div>
							<p className="text-gray-600">
								Comments for post: {currentModalPost.title}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
