import bcrypt from "bcrypt";
import User from "../models/User";

export const signup = async (req: any, res: any) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Email is already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		res.status(201).json({
			message: "User created successfully",
			user: newUser,
		});
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create user", error });
	}
};

export const login = async (req: any, res: any) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid email or password" });
		}

		if (user.isBanned) {
			return res.status(400).json({ message: "You are banned" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ message: "Invalid email or password" });
		}

		res.status(200).json({ message: "Login successful", user });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to login", error });
	}
};

export const getUserById = async (req: any, res: any) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch user", error });
	}
};

export const getAllUsers = async (req: any, res: any) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch users", error });
	}
};

export const deleteUser = async (req: any, res: any) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to delete user", error });
	}
};

export const toggleBanUser = async (req: any, res: any) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		user.isBanned = !user.isBanned;
		await user.save();
		res.status(200).json({ message: "User banned status updated" });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to ban user", error });
	}
};
