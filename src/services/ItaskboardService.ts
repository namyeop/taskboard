import { Task } from "@types-taskboard/taskboard";

export interface ITaskBoardService {
	createTask(task: Omit<Task, "id">): Promise<void | null>;
	getAllTasks(): Promise<Task[]>;
	getTaskByUuid(uuid: string): Promise<Task | null>;
	updateTaskStatus(uuid: string, status: Task["status"]): Promise<void | null>;
	getTasksByStatus(status: Task["status"]): Promise<Task[]>;
}
