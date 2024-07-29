import jwt from "jsonwebtoken";
import IUserService from "../IUserService";
import UserRepository from "../../repositories/user.repository";

export class UserServiceImpl implements IUserService {
	private userRepository: UserRepository;
	private jwtSecret: string;

	constructor(userRepository: UserRepository, jwtSecret: string) {
		this.userRepository = userRepository;
		this.jwtSecret = jwtSecret;
	}

	async createUser(user: {
		username: string;
		password: string;
	}): Promise<void> {
		return this.userRepository.registerUser(user.username, user.password);
	}
	async loginUser(username: string, password: string): Promise<string | null> {
		const isAuthenticated = await this.userRepository.loginUser(
			username,
			password,
		);
		if (isAuthenticated) {
			return jwt.sign({ username }, this.jwtSecret, {
				expiresIn: "1h",
			});
		}
		return null;
	}
}
