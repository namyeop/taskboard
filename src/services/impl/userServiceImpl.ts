import jwt from "jsonwebtoken";
import IUserService from "../IUserService";
import UserRepository from "../../repositories/user.repository";
import { jwtConfig } from "../../config/config";

export class UserServiceImpl implements IUserService {
	private userRepository: UserRepository;
	private jwtSecret: string;
	private jwtRefreshSecret: string;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
		this.jwtSecret = jwtConfig.jwtSecret;
		this.jwtRefreshSecret = jwtConfig.jwtRefreshSecret;
	}

	async createUser(user: {
		username: string;
		password: string;
	}): Promise<void> {
		return this.userRepository.registerUser(user.username, user.password);
	}

	async loginUser(
		username: string,
		password: string,
	): Promise<{ token: string; refreshToken: string } | null> {
		const isAuthenticated = await this.userRepository.loginUser(
			username,
			password,
		);
		if (isAuthenticated) {
			const token = jwt.sign({ username }, this.jwtSecret, {
				expiresIn: "1h",
			});
			const refreshToken = jwt.sign({ username }, this.jwtRefreshSecret, {
				expiresIn: "7d",
			});

			return { token, refreshToken };
		} else {
			return null;
		}
	}
}
