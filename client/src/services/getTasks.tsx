import axios from "axios";
import { Task } from "../types";

const refreshToekn = () => {
	const refreshToken = localStorage.getItem("refreshToken");
	if (refreshToken) {
		axios
			.post("http://localhost:3000/refreshToken", {
				refreshToken,
			})
			.then((res) => {
				if (res.status === 200) {
					const token = res.data.token;
					localStorage.setItem("token", token);
				}
			});
	}
};

const getTasks = async (setTasks: React.SetStateAction) => {
	axios.interceptors.request.use(
		(config) => {
			const token = localStorage.getItem("token");
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		},
	);

	axios.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error.response.status === 401) {
				refreshToekn();
			}
			return Promise.reject(error);
		},
	);

	try {
		const res = await axios.get("http://localhost:3000");
		if (res.data.length > 0) {
			const tasksByStatus: { [key: string]: Task[] } = {};
			res.data.forEach((task: Task) => {
				if (tasksByStatus[task.status]) {
					tasksByStatus[task.status].push(task);
				}
			});
			setTasks(tasksByStatus);
		}
	} catch (error) {
		if (error.response.status === 401) {
			try {
				await refreshToken();
				const res = await axios.get("http://localhost:3000");
				if (res.data.length > 0) {
					const tasksByStatus: { [key: string]: Task[] } = {};
					res.data.forEach((task: Task) => {
						if (tasksByStatus[task.status]) {
							tasksByStatus[task.status].push(task);
						}
					});
					setTasks(tasksByStatus);
				}
			} catch (retryError) {
				alert("로그인이 필요합니다." + retryError);
			}
		} else {
			alert("로그인이 필요합니다." + error);
		}
	}
};

export default getTasks;
