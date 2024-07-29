import { UserServiceImpl } from "../services/impl/userServiceImpl";
import IUserService from "../services/IUserService";
import UserRepository from "../repositories/user.repository";
import Database from "../databases/database";

// Mock UserRepository
class MockUserRepository extends UserRepository {
	constructor() {
		super(Database.getInstance());
	}

	async registerUser(username: string, password: string): Promise<void> {}

	async loginUser(username: string, password: string): Promise<boolean> {
		return true;
	}
}

test("loginUser should return tokens if authentication is successful", async () => {
	const mockUserRepository = new MockUserRepository();
	const userService: IUserService = new UserServiceImpl(
		mockUserRepository,
		"secret",
		"refreshSecret",
	);

	const result = await userService.loginUser("testuser", "password");
	expect(result).not.toBeNull();
	expect(result).toHaveProperty("token");
	expect(result).toHaveProperty("refreshToken");
});
