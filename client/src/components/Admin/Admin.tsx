import { Users, FileText, Boxes, ChartBar, UserCog } from "lucide-react";
import { Link } from "react-router-dom";

export default function Admin() {
	const adminOptions = [
		{
			title: "Manage Users",
			description: "View, ban, and manage all users.",
			icon: <Users className="w-10 h-10 text-blue-500" />,
			link: "/admin/manage-users",
		},
		{
			title: "Manage Reports",
			description: "Accept, reject, and manage all reports.",
			icon: <FileText className="w-10 h-10 text-green-500" />,
			link: "/admin/manage-posts",
		},
		{
			title: "Manage Groups",
			description: "View, edit, and manage all groups.",
			icon: <Boxes className="w-10 h-10 text-yellow-500" />,
			link: "/admin/manage-groups",
		},
		{
			title: "Analytics",
			description: "View analytics and insights.",
			icon: <ChartBar className="w-10 h-10 text-purple-500" />,
			link: "/admin/analytics",
		},
	];

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
			<h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-11/12 max-w-4xl">
				{adminOptions.map((option, index) => (
					<Link
						key={index}
						to={option.link}
						className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow"
					>
						<div className="mb-4">{option.icon}</div>
						<h2 className="text-xl font-semibold mb-2">
							{option.title}
						</h2>
						<p className="text-gray-500 text-center">
							{option.description}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
}
