import Report from "../models/Report";
import Post from "../models/Post";
import User from "../models/User";

export const addNewReport = async (req: any, res: any) => {
	try {
		const { post, user, reason, description } = req.body;

		if (!post || !user || !reason || !description) {
			return res.status(400).json({
				message: "Post, user, reason, and description are required",
			});
		}

		const userExists = await User.findById(user);
		if (!userExists) {
			return res.status(404).json({ message: "User not found" });
		}

		const postExists = await Post.findById(post);
		if (!postExists) {
			return res.status(404).json({ message: "Post not found" });
		}

		const existingReport = await Report.findOne({ post, user });
		if (existingReport) {
			return res
				.status(400)
				.json({ message: "You have already reported this post" });
		}

		const newReport = new Report({
			post,
			user,
			reason,
			description,
		});

		const savedReport = await newReport.save();

		res.status(201).json({
			message: "Report added successfully",
			report: savedReport,
		});
	} catch (error: any) {
		res.status(500).json({ message: "Failed to add report", error });
	}
};

export const deleteReportById = async (req: any, res: any) => {
	try {
		const { reportId } = req.params;

		if (!reportId) {
			return res.status(400).json({ message: "Report ID is required" });
		}

		const report = await Report.findById(reportId);
		if (!report) {
			return res.status(404).json({ message: "Report not found" });
		}

		await Report.findByIdAndDelete(reportId);

		res.status(200).json({ message: "Report deleted successfully" });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to delete report", error });
	}
};

export const getAllReports = async (req: any, res: any) => {
	try {
		const reports = await Report.find()
			.populate("post", "title")
			.populate("user", "name email");

		res.status(200).json({
			message: "Reports fetched successfully",
			reports,
		});
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch reports", error });
	}
};

export const deletePostByReportId = async (req: any, res: any) => {
	try {
		const { reportId } = req.params;

		if (!reportId) {
			return res.status(400).json({ message: "Report ID is required" });
		}

		const report = await Report.findById(reportId).populate("post");
		if (!report) {
			return res.status(404).json({ message: "Report not found" });
		}

		const postId = report.post._id;

		await Report.deleteMany({ post: postId });

		await Post.findByIdAndDelete(postId);

		res.status(200).json({
			message: "Post and related reports deleted successfully",
		});
	} catch (error: any) {
		res.status(500).json({
			message: "Failed to delete post by report",
			error,
		});
	}
};

export const searchReports = async (req: any, res: any) => {
	try {
		const { query } = req.body;

		if (!query || query.trim() === "") {
			return res
				.status(400)
				.json({ message: "Search query is required" });
		}

		const searchRegex = new RegExp(query, "i");

		const reports = await Report.aggregate([
			{
				$lookup: {
					from: "posts",
					localField: "post",
					foreignField: "_id",
					as: "post",
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "user",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$unwind: {
					path: "$post",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: "$user",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: {
					$or: [
						{ reason: searchRegex },
						{ description: searchRegex },
						{ "post.title": searchRegex },
						{ "post.content": searchRegex },
						{ "user.name": searchRegex },
						{ "user.email": searchRegex },
					],
				},
			},
		]);

		res.status(200).json({
			message: "Reports fetched successfully",
			reports,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to fetch reports",
			error,
		});
	}
};
