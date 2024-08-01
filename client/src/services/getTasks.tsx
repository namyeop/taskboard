import axios from "../utils/axiosConfig";
import { Task } from "../types";

const getTasks = async (setTasks: React.SetStateAction) => {
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
		return Promise.reject(error);
	}
};

export default getTasks;
