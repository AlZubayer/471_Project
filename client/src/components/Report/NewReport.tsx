import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";

export default function NewReport() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [reason, setReason] = useState("");
	const [description, setDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!reason.trim() || !description.trim()) {
			toast.error("Both reason and description are required.");
			return;
		}

		if (!user) {
			toast.error("You need to be logged in to submit a report.");
			return;
		}

		setIsSubmitting(true);

		try {
			const body = {
				post: id,
				user: user.id,
				reason,
				description,
			};

			const response = await fetch("http://localhost:5000/api/report", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const data = await response.json();

			if (!response.ok) {
				toast.error(data.message);
				return;
			}

			toast.success("Report submitted successfully.");
			navigate("/");
		} catch (error) {
			toast.error("Failed to submit the report.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
			<div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
				<h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
					New Report
				</h1>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="reason"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Reason
						</label>
						<select
							id="reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">-- Select a reason --</option>
							<option value="Inappropriate content">
								Inappropriate content
							</option>
							<option value="Spam">Spam</option>
							<option value="Harassment">Harassment</option>
							<option value="Other">Other</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Provide additional details..."
							className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							rows={5}
						></textarea>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className={`w-full px-4 py-2 text-white rounded-md transition ${
							isSubmitting
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700"
						}`}
					>
						{isSubmitting ? "Submitting..." : "Submit Report"}
					</button>
				</form>
			</div>
		</div>
	);
}
