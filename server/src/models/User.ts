import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	userType: {
		type: String,
		required: true,
		enum: ["admin", "user", "companion"],
		default: "user",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	isBanned: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
