import http from "http";
import { Server, Socket } from "socket.io";
import Database from "../../databases/database";
import { ColumnId, Task } from "@types-taskboard/taskboard";
import { ITaskBoardService } from "../ItaskboardService";
import TaskBoardRepository from "../../repositories/taskboard.repository";

export class TaskBoardServiceImpl implements ITaskBoardService {
	private io: Server;
	private taskBoardRepository: TaskBoardRepository;

	constructor(taskboardRepository: TaskBoardRepository, server: http.Server) {
		this.taskBoardRepository = taskboardRepository;
		this.io = new Server(server, {
			cors: {
				origin: "http://localhost:5173",
			},
		});
		this.initialize();
	}

	private async initialize() {
		this.io.on("connect", async (socket: Socket) => {
			const tasks = await this.getAllTasks();
			if (!tasks) {
				this.io.emit("getAllTasks", tasks);
			}
			socket.on("createTask", (task: Task) => {
				this.createTask(task);
			});
			socket.on("updateTask", (task: Task) => {
				this.updateTaskStatus(task.uuid, task.status);
			});

			socket.on("deleteTask", (uuid: string) => {
				this.deleteTask(uuid);
			});
		});
	}

	async createTask(task: Omit<Task, "id">): Promise<void> {
		try {
			const newTask = await this.taskBoardRepository.createTask(task);
			if (!newTask) {
				throw new Error("Error creating task");
			} else {
				this.io.emit("taskCreated", newTask);
			}
		} catch (error) {
			console.error("Error creating task:", error);
		}
	}

	async getTaskByUuid(uuid: string): Promise<Task | null> {
		return this.taskBoardRepository.getTaskByUuid(uuid);
	}

	async updateTaskStatus(uuid: string, status: ColumnId): Promise<void> {
		try {
			const updatedTask = await this.taskBoardRepository.updateTaskStatus(
				uuid,
				status,
			);
			if (!updatedTask) {
				throw new Error("Error updating task");
			} else {
				this.io.emit("taskUpdated", updatedTask);
			}
		} catch (error) {
			console.error("Error updating task:", error);
		}
	}

	async getAllTasks(): Promise<Task[]> {
		try {
			const tasks = await this.taskBoardRepository.getAllTasks();
			return tasks;
		} catch (error) {
			throw new Error("Error fetching all tasks");
		}
	}

	async getTasksByStatus(status: Task["status"]): Promise<Task[]> {
		return this.taskBoardRepository.getTasksByStatus(status);
	}

	async deleteTask(uuid: string): Promise<void> {
		return this.taskBoardRepository.deleteTask(uuid);
	}
}
