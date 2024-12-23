import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	Users,
	FileText,
	Boxes,
	MessageCircle,
	ShieldAlert,
	ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManageAnalytics() {
	const [analytics, setAnalytics] = useState<any | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchAnalytics();
	}, []);

	const fetchAnalytics = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/analytics");
			if (!response.ok) throw new Error("Failed to fetch analytics.");
			const data = await response.json();
			setAnalytics(data);
		} catch (error) {
			toast.error("Failed to fetch analytics.");
		}
	};

	if (!analytics) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<p className="text-gray-500 text-lg">Loading analytics...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
			<div className="w-full max-w-4xl flex items-center justify-between mb-8">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
				>
					<ArrowLeft className="w-4 h-4" />
					<span>Back</span>
				</button>
				<h1 className="text-3xl font-bold">Website Analytics</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-11/12 max-w-4xl">
				<div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
					<Users className="w-10 h-10 text-blue-500 mb-4" />
					<h2 className="text-xl font-semibold mb-2">Total Users</h2>
					<p className="text-2xl font-bold text-gray-800 mb-2">
						{analytics?.users?.total || 0}
					</p>
					<p className="text-gray-500 text-center">
						{analytics?.users?.active || 0} active,{" "}
						{analytics?.users?.banned || 0} banned
					</p>
					<ul className="text-gray-500 text-center mt-2">
						{(analytics?.users?.types || []).map((type: any) => (
							<li key={type._id}>
								{type._id}: {type.count}
							</li>
						))}
					</ul>
				</div>

				<div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
					<FileText className="w-10 h-10 text-green-500 mb-4" />
					<h2 className="text-xl font-semibold mb-2">Total Posts</h2>
					<p className="text-2xl font-bold text-gray-800 mb-2">
						{analytics?.posts?.total || 0}
					</p>
					<p className="text-gray-500 text-center">
						{analytics?.posts?.anonymous || 0} anonymous posts
					</p>
					{analytics?.posts?.mostUpvotedPost && (
						<p className="text-sm text-gray-500 mt-2">
							Most upvoted post:{" "}
							<strong>
								{analytics.posts.mostUpvotedPost.title}
							</strong>
						</p>
					)}
				</div>

				<div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
					<MessageCircle className="w-10 h-10 text-yellow-500 mb-4" />
					<h2 className="text-xl font-semibold mb-2">
						Total Comments
					</h2>
					<p className="text-2xl font-bold text-gray-800 mb-2">
						{analytics?.comments?.total || 0}
					</p>
					{analytics?.comments?.mostCommentedPost ? (
						<p className="text-sm text-gray-500 mt-2">
							Most commented post:{" "}
							<strong>
								{analytics.comments.mostCommentedPost.title}
							</strong>
						</p>
					) : (
						<p className="text-gray-500 mt-2">No comments yet</p>
					)}
				</div>

				<div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
					<ShieldAlert className="w-10 h-10 text-red-500 mb-4" />
					<h2 className="text-xl font-semibold mb-2">
						Total Reports
					</h2>
					<p className="text-2xl font-bold text-gray-800 mb-2">
						{analytics?.reports?.total || 0}
					</p>
					{analytics?.reports?.mostReportedPost ? (
						<p className="text-sm text-gray-500 mt-2">
							Most reported post:{" "}
							<strong>
								{analytics.reports.mostReportedPost.title}
							</strong>
						</p>
					) : (
						<p className="text-gray-500 mt-2">No reports yet</p>
					)}
				</div>

				<div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
					<Boxes className="w-10 h-10 text-purple-500 mb-4" />
					<h2 className="text-xl font-semibold mb-2">Total Groups</h2>
					<p className="text-2xl font-bold text-gray-800 mb-2">
						{analytics?.groups?.total || 0}
					</p>
					{analytics?.groups?.mostPopularGroup ? (
						<p className="text-sm text-gray-500 mt-2">
							Most popular group:{" "}
							<strong>
								{analytics.groups.mostPopularGroup.name}
							</strong>
						</p>
					) : (
						<p className="text-gray-500 mt-2">No groups yet</p>
					)}
				</div>
			</div>
		</div>
	);
}
