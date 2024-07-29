import { Request, Response } from "express";
import { UserServiceImpl } from "../services/impl/userServiceImpl";
import UserRepository from "../repositories/user.repository";
import { jwtConfig } from "../config/config";

export class UserController {
	private userService: UserServiceImpl;

	constructor(userRepository: UserRepository) {
		this.userService = new UserServiceImpl(
			userRepository,
			jwtConfig.jwtSecret,
			jwtConfig.jwtRefreshSecret,
		);
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
			this.userService.loginUser(username, password).then((token) => {
				if (token) {
					res.status(200).json({ token });
				} else {
					res.status(401).json({ error: "Invalid credentials" });
				}
			});
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}
}
