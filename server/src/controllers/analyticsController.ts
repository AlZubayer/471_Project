import Report from "../models/Report";
import Post from "../models/Post";
import User from "../models/User";
import Comment from "../models/Comment";
import Group from "../models/Group";

export const getAnalytics = async (req: any, res: any) => {
	try {
		const totalUsers = await User.countDocuments();
		const activeUsers = await User.countDocuments({ isBanned: false });
		const bannedUsers = await User.countDocuments({ isBanned: true });
		const userTypes = await User.aggregate([
			{ $group: { _id: "$userType", count: { $sum: 1 } } },
		]);

		const totalPosts = await Post.countDocuments();
		const anonymousPosts = await Post.countDocuments({ isAnonymous: true });
		const mostUpvotedPost = await Post.find()
			.sort({ upvotedBy: -1 })
			.limit(1)
			.populate("group", "name")
			.select("title upvotedBy group");

		const totalComments = await Comment.countDocuments();
		const mostCommentedPost = await Comment.aggregate([
			{ $group: { _id: "$post", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 1 },
		]);
		const mostCommentedPostDetails = mostCommentedPost.length
			? await Post.findById(mostCommentedPost[0]._id).select("title")
			: null;

		const totalReports = await Report.countDocuments();
		const mostReportedPost = await Report.aggregate([
			{ $group: { _id: "$post", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 1 },
		]);
		const mostReportedPostDetails = mostReportedPost.length
			? await Post.findById(mostReportedPost[0]._id).select("title")
			: null;

		const totalGroups = await Group.countDocuments();
		const mostPopularGroup = await Post.aggregate([
			{ $group: { _id: "$group", count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 1 },
		]);
		const mostPopularGroupDetails = mostPopularGroup.length
			? await Group.findById(mostPopularGroup[0]._id).select("name")
			: null;

		res.status(200).json({
			users: {
				total: totalUsers,
				active: activeUsers,
				banned: bannedUsers,
				types: userTypes,
			},
			posts: {
				total: totalPosts,
				anonymous: anonymousPosts,
				mostUpvotedPost,
			},
			comments: {
				total: totalComments,
				mostCommentedPost: mostCommentedPostDetails,
			},
			reports: {
				total: totalReports,
				mostReportedPost: mostReportedPostDetails,
			},
			groups: {
				total: totalGroups,
				mostPopularGroup: mostPopularGroupDetails,
			},
		});
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch analytics", error });
	}
};
