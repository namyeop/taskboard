import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

const SignUp: React.FC = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [passwordConfirm, setPasswordConfirm] = useState<string>("");
	const [validationMessage, setValidationMessage] = useState<string>("");
	const navigate = useNavigate();

	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	const handlePasswordConfirmChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setPasswordConfirm(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const passwordRegex =
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$])[A-Za-z\d!@#$]{8,}$/;

		if (password !== passwordConfirm) {
			setValidationMessage("패스워드가 동일하지 않아요.");
			return;
		}
		if (password.length < 8) {
			setValidationMessage("패스워드는 8자 이상이어야 해요.");
			return;
		}
		if (!password.match(passwordRegex)) {
			setValidationMessage("패스워드는 문자와 숫자를 포함해야 해요.");
			return;
		}
		setValidationMessage("");

		axios
			.post("http://localhost:3000/signup", {
				username,
				password,
			})
			.then((res) => {
				if (res.status === 201) {
					alert("회원가입 성공!");
					navigate({ to: "/login" });
				}
			});
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg">
			<h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
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
				<div className="mb-4">
					<label className="block text-white mb-2" htmlFor="email">
						Confirm Password
					</label>
					<input
						type="password"
						id="passwordConfirm"
						value={passwordConfirm}
						onChange={handlePasswordConfirmChange}
						className="w-full px-3 py-2 text-gray-900 rounded"
						required
					/>
				</div>
				{validationMessage && (
					<div className="mb-4 text-red-500">{validationMessage}</div>
				)}
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
					Sign Up
				</button>
			</form>
		</div>
	);
};

export default SignUp;
