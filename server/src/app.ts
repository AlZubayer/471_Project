import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import {
	signup,
	login,
	getUserById,
	deleteUser,
	toggleBanUser,
	getAllUsers,
	searchUsers,
} from "./controllers/userController";
import {
	addNewGroup,
	deleteGroup,
	editGroup,
	getAllGroups,
} from "./controllers/groupController";
import {
	addNewPost,
	fetchPosts,
	addUpvote,
	deletePost,
} from "./controllers/postController";
import {
	addNewComment,
	deleteComment,
	getCommentsByPostId,
} from "./controllers/commentController";
import {
	addNewReport,
	deletePostByReportId,
	deleteReportById,
	getAllReports,
	searchReports,
} from "./controllers/ReportController";
import { getAnalytics } from "./controllers/analyticsController";
import connectDB from "./config/db";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
	const contentLength = req.headers["content-length"];
	console.log(
		`==> \x1b[33m${req.method} ${req.url}\x1b[0m` +
			" " +
			`\x1b[36mPayload Size: ${
				contentLength ? contentLength + " bytes" : "unknown"
			}\x1b[0m\n`
	);
	next();
});

const startServer = async () => {
	await connectDB();

	app.post("/api/signup", signup);
	app.post("/api/login", login);
	app.get("/api/user/:id", getUserById);
	app.delete("/api/user/:id", deleteUser);
	app.put("/api/user/:id", toggleBanUser);
	app.get("/api/users", getAllUsers);
	app.post("/api/searchUsers", searchUsers);

	app.post("/api/group", addNewGroup);
	app.put("/api/group", editGroup);
	app.delete("/api/group/:id", deleteGroup);
	app.get("/api/groups", getAllGroups);

	app.post("/api/post", addNewPost);
	app.post("/api/getPosts", fetchPosts);
	app.post("/api/post/upvote", addUpvote);
	app.delete("/api/post", deletePost);

	app.post("/api/comment", addNewComment);
	app.delete("/api/comment", deleteComment);
	app.post("/api/getComments", getCommentsByPostId);

	app.post("/api/report", addNewReport);
	app.delete("/api/report/:reportId", deleteReportById);
	app.delete("/api/report/:reportId/post", deletePostByReportId);
	app.get("/api/reports", getAllReports);
    app.post("/api/searchReports", searchReports);

	app.get("/api/analytics", getAnalytics);

	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => console.log(`Server Working`));
};

startServer();
