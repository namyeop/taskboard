import React, { useState } from "react";

interface SignInProps {
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignIn: React.FC<SignInProps> = ({ setIsLoggedIn }) => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoggedIn(true);
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg">
			<h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-white mb-2" htmlFor="username">
						Username
					</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={handleUsernameChange}
						className="w-full px-3 py-2 text-gray-900 rounded"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-white mb-2" htmlFor="password">
						Password
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={handlePasswordChange}
						className="w-full px-3 py-2 text-gray-900 rounded"
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white px-4 py-2 rounded">
					Login
				</button>
			</form>
		</div>
	);
};

export default SignIn;