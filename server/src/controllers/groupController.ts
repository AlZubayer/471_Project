import Group from "../models/Group";

export const addNewGroup = async (req: any, res: any) => {
	try {
		const { name } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Name is required" });
		}

		const groupExists = await Group.findOne({ name });

		if (groupExists) {
			return res.status(400).json({ message: "Group already exists" });
		}

		const group = await Group.create({ name });
		res.status(201).json(group);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to create group", error });
	}
};

export const getAllGroups = async (req: any, res: any) => {
	try {
		const groups = await Group.find();
		res.status(200).json(groups);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to fetch groups", error });
	}
};

export const editGroup = async (req: any, res: any) => {
	try {
		const { name, id } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Name is required" });
		}

		const group = await Group.findByIdAndUpdate(
			id,
			{ name },
			{ new: true }
		);

		if (!group) {
			return res.status(404).json({ message: "Group not found" });
		}

		res.status(200).json(group);
	} catch (error: any) {
		res.status(500).json({ message: "Failed to update group", error });
	}
};

export const deleteGroup = async (req: any, res: any) => {
	try {
		const group = await Group.findByIdAndDelete(req.params.id);

		if (!group) {
			return res.status(404).json({ message: "Group not found" });
		}

		res.status(200).json({ message: "Group deleted successfully" });
	} catch (error: any) {
		res.status(500).json({ message: "Failed to delete group", error });
	}
};
