export default interface IUserService {
	createUser(user: { username: string; password: string }): Promise<void>;
	loginUser(username: string, password: string): Promise<boolean>;
}
