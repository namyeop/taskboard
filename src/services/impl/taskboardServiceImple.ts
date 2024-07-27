import { TaskBoardService } from "../taskboardService";
import TaskBoardRepository from "../../repositories/taskboard.repository";
import { Task } from "@types-taskboard/taskboard";

export class TaskBoardServiceImpl implements TaskBoardService {
	private taskBoardRepository: TaskBoardRepository;

	constructor() {
		this.taskBoardRepository = new TaskBoardRepository();
	}

	public async createTask(task: Task): Promise<void> {
		await this.taskBoardRepository.createTask(
			task.uuid,
			task.taskText,
			task.status,
		);
	}

	public async getTask(uuid: string): Promise<Task[]> {
		return await this.taskBoardRepository.readTask(uuid);
	}
}
