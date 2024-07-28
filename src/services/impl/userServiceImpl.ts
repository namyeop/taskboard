import IUserService from "../IUserService";
import UserRepository from "../../repositories/user.repository";

export class UserServiceImpl implements IUserService {
	private userRepository: UserRepository;

	constructor() {
		this.userRepository = new UserRepository();
	}

	async createUser(user: {
		username: string;
		password: string;
	}): Promise<void> {
		return this.userRepository.registerUser(user.username, user.password);
	}
	async loginUser(username: string, password: string): Promise<boolean> {
		return this.userRepository.loginUser(username, password);
	}
}
