import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Trash2, CheckCircle, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Report {
	_id: string;
	post: { _id: string; title: string };
	user: { _id: string; name: string; email: string };
	reason: string;
	description: string;
	createdAt: string;
}

export default function ManageReport() {
	const [reports, setReports] = useState<Report[]>([]);
	const [searchText, setSearchText] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		fetchReports();
	}, []);

	const fetchReports = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/reports");
			if (!response.ok) throw new Error("Failed to fetch reports.");
			const data = await response.json();
			setReports(data.reports);
		} catch (error) {
			toast.error("Failed to fetch reports.");
		}
	};

	const handleSearch = async () => {
		if (!searchText.trim()) {
			fetchReports();
			return;
		}

		try {
			const response = await fetch(
				"http://localhost:5000/api/searchReports",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ query: searchText }),
				}
			);
			if (!response.ok) throw new Error("Failed to search reports.");
			const data = await response.json();
			setReports(data.reports);
		} catch (error) {
			toast.error("Failed to search reports.");
		}
	};

	const handleResolve = async (reportId: string) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/report/${reportId}/post`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) throw new Error("Failed to resolve report.");
			toast.success("Post deleted and report resolved.");
			fetchReports();
		} catch (error) {
			toast.error("Failed to resolve report.");
		}
	};

	const handleReject = async (reportId: string) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/report/${reportId}`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) throw new Error("Failed to reject report.");
			toast.success("Report rejected successfully.");
			fetchReports();
		} catch (error) {
			toast.error("Failed to reject report.");
		}
	};

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
				<h1 className="text-3xl font-bold">Manage Reports</h1>
			</div>

			<div className="w-full max-w-4xl flex items-center mb-6">
				<input
					type="text"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					placeholder="Search by user info, post info, or reason"
					className="flex-grow px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
				<button
					onClick={handleSearch}
					className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600 transition"
				>
					<Search className="w-5 h-5 mr-2" />
					Search
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
				{reports.length === 0 ? (
					<p className="text-gray-500 text-center w-full">
						No reports available.
					</p>
				) : (
					reports.map((report) => (
						<div
							key={report._id}
							className="bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-4 border hover:shadow-xl transition-shadow"
						>
							<h2 className="text-lg font-semibold text-gray-800">
								Reported Post:
							</h2>
							<p className="bg-gray-100 px-3 py-2 rounded-md text-sm font-medium text-gray-700">
								{report.post.title}
							</p>
							<div>
								<p className="text-sm text-gray-600">
									<strong>Reported By:</strong>{" "}
									{report.user.name} ({report.user.email})
								</p>
								<p className="text-sm text-gray-600">
									<strong>Reason:</strong> {report.reason}
								</p>
								<p className="text-sm text-gray-600">
									<strong>Description:</strong>{" "}
									{report.description}
								</p>
								<p className="text-xs text-gray-500 mt-2">
									Reported On:{" "}
									{new Date(
										report.createdAt
									).toLocaleDateString()}
								</p>
							</div>
							<div className="flex gap-4 justify-between mt-4">
								<button
									title="resolve"
									onClick={() => handleResolve(report._id)}
									className="px-4 py-2 bg-red-500 text-white text-nowrap rounded-md flex items-center hover:bg-red-600 transition"
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete Post
								</button>
								<button
									title="reject"
									onClick={() => handleReject(report._id)}
									className="px-4 py-2 bg-green-500 text-white text-nowrap rounded-md flex items-center hover:bg-green-600 transition"
								>
									<CheckCircle className="w-4 h-4 mr-2" />
									Reject Report
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
