import { Request, Response } from "express";
import { UserServiceImpl } from "../services/impl/userServiceImpl";

export class UserController {
	private userService: UserServiceImpl;

	constructor() {
		this.userService = new UserServiceImpl();
	}

	async createUser(req: Request, res: Response) {
		try {
			const { username, password } = req.body;
			const user = await this.userService.createUser({
				username,
				password,
			});
			res.status(201).json(user);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async loginUser(req: Request, res: Response) {
		try {
			const { username, password } = req.body;
			const user = await this.userService.loginUser(username, password);
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}
}
