import { Request, Response } from "express";
import { UserServiceImpl } from "../services/impl/userServiceImpl";
import UserRepository from "../repositories/user.repository";

export class UserController {
	private userService: UserServiceImpl;
	private jwtSecret: string;
	private jwtRefreshSecret: string;

	constructor(userRepository: UserRepository) {
		this.jwtSecret = process.env.JWT_SECRET || "secret";
		this.jwtRefreshSecret = process.env.JWT_REFRESH || "refresh";
		this.userService = new UserServiceImpl(
			userRepository,
			this.jwtSecret,
			this.jwtRefreshSecret,
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
