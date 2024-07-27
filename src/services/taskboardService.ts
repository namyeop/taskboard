import { Task } from "@types-taskboard/taskboard";

export interface TaskBoardService {
	createTask(task: Task): Promise<void>;
	getTask(uuid: string): Promise<Task[]>;
}
