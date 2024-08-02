import axios from "../utils/axiosConfig";
import { Task } from "@types-taskboard/taskboard";

const getTasks = async (): Promise<{ [key: string]: Task[] }> => {
	try {
		const res = await axios.get("http://localhost:3000");
		if (res.data.length > 0) {
			const tasksByStatus: { [key: string]: Task[] } = {
				todo: [],
				inProgress: [],
				done: [],
			};
			res.data.forEach((task: Task) => {
				if (tasksByStatus[task.status]) {
					tasksByStatus[task.status].push(task);
				}
			});
			return tasksByStatus;
		}
		return {};
	} catch (error) {
		return Promise.reject(error);
	}
};

export default getTasks;
