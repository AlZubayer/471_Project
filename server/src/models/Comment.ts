import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		required: true,
	},
});

const Comment =
	mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;
