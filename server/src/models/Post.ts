import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Group",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: false,
	},
	isAnonymous: {
		type: Boolean,
		default: false,
	},
	avatar: {
		type: String,
		required: false,
		enum: ["1", "2", "3"],
	},
	nickname: {
		type: String,
		required: false,
	},
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	upvotedBy: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;
