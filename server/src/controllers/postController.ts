import Group from "../models/Group";
import Post from "../models/Post";
import User from "../models/User";

export const addNewPost = async (req: any, res: any) => {
	try {
		const { group, user, isAnonymous, avatar, nickname, title, content } =
			req.body;

		if (!group || !title || !content) {
			return res
				.status(400)
				.json({ message: "Group, title, and content are required" });
		}

		const groupExists = await Group.findById(group);
		if (!groupExists) {
			return res.status(404).json({ message: "Group not found" });
		}

		let avatarToSave = null;
		let nicknameToSave = null;

		if (isAnonymous) {
			if (!avatar || !nickname) {
				return res.status(400).json({
					message:
						"Avatar and nickname are required for anonymous posts",
				});
			}
			avatarToSave = avatar;
			nicknameToSave = nickname;
		}

		const userExists = await User.findById(user);
		if (!userExists) {
			return res.status(404).json({ message: "User not found" });
		}

		const newPost = new Post({
			group,
			user: user,
			isAnonymous,
			avatar: avatarToSave,
			nickname: nicknameToSave,
			title,
			content,
		});

		const savedPost = await newPost.save();

		res.status(201).json({
			message: "Post created successfully",
			post: savedPost,
		});
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create post", error });
	}
};

export const fetchPosts = async (req: any, res: any) => {
	try {
		const { group, searchText } = req.body;

		let filter: any = {};

		if (group) {
			const groupExists = await Group.findById(group);
			if (!groupExists) {
				return res.status(404).json({ message: "Group not found" });
			}
			filter.group = group;
		}

		if (searchText) {
			const textFilter = {
				$or: [
					{ title: { $regex: searchText, $options: "i" } },
					{ content: { $regex: searchText, $options: "i" } },
					{ nickname: { $regex: searchText, $options: "i" } },
				],
			};
			filter = group ? { ...filter, ...textFilter } : textFilter;
		}

		const posts = await Post.find(filter)
			.populate("group", "name")
			.populate("user", "name email");

		res.status(200).json({ message: "Posts fetched successfully", posts });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch posts", error });
	}
};

export const addUpvote = async (req: any, res: any) => {
	try {
		const { user, postId } = req.body;

		if (!user || !postId) {
			return res
				.status(400)
				.json({ message: "User and Post ID are required" });
		}

		const userExists = await User.findById(user);
		if (!userExists) {
			return res.status(404).json({ message: "User not found" });
		}
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		if (post.upvotedBy.includes(user)) {
			return res
				.status(400)
				.json({ message: "User has already upvoted this post" });
		}

		post.upvotedBy.push(user);

		await post.save();

		res.status(200).json({ message: "Upvote added successfully", post });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to add upvote", error });
	}
};

export const deletePost = async (req: any, res: any) => {
	try {
		const { postId } = req.body;

		if (!postId) {
			return res.status(400).json({ message: "Post ID is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		await Post.findByIdAndDelete(postId);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to delete post", error });
	}
};
