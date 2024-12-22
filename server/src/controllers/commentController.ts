import Comment from "../models/Comment";
import Post from "../models/Post";
import User from "../models/User";

export const addNewComment = async (req: any, res: any) => {
	try {
		const { content, user, post } = req.body;

		if (!content || !user || !post) {
			return res
				.status(400)
				.json({ message: "Content, user, and post are required" });
		}

		const userExists = await User.findById(user);
		if (!userExists) {
			return res.status(404).json({ message: "User not found" });
		}

		const postExists = await Post.findById(post);
		if (!postExists) {
			return res.status(404).json({ message: "Post not found" });
		}

		const newComment = new Comment({
			content,
			user,
			post,
		});

		const savedComment = await newComment.save();

		res.status(201).json({
			message: "Comment added successfully",
			comment: savedComment,
		});
	} catch (error: any) {
		res.status(500).json({ message: "Failed to add comment", error });
	}
};

export const getCommentsByPostId = async (req: any, res: any) => {
	try {
		const { postId } = req.body;

		if (!postId) {
			return res.status(400).json({ message: "Post ID is required" });
		}

		const comments = await Comment.find({ post: postId })
			.populate("user", "name email")
			.populate("post", "title");

		res.status(200).json({
			message: "Comments fetched successfully",
			comments,
		});
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch comments", error });
	}
};

export const deleteComment = async (req: any, res: any) => {
	try {
		const { commentId } = req.body;

		if (!commentId) {
			return res.status(400).json({ message: "Comment ID is required" });
		}

		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		await Comment.findByIdAndDelete(commentId);

		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error: any) {
		console.log(error);
		res.status(500).json({ message: "Failed to delete comment", error });
	}
};
