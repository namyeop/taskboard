import http from "http";
import { Request, Response } from "express";
import { TaskBoardServiceImpl } from "../services/impl/taskboardServiceImpl";

export class TaskBoardController {
	private taskBoardService: TaskBoardServiceImpl;

	constructor(server: http.Server) {
		this.taskBoardService = new TaskBoardServiceImpl(server);
	}

	async createTask(req: Request, res: Response) {
		try {
			const { uuid, taskText, status } = req.body;
			const task = await this.taskBoardService.createTask({
				uuid,
				taskText,
				status,
			});
			res.status(201).json(task);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getAllTasks(req: Request, res: Response) {
		try {
			const tasks = await this.taskBoardService.getAllTasks();
			res.json(tasks);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getTasksByStatus(req: Request, res: Response) {
		try {
			const { status } = req.params;
			if (!["todo", "in_progress", "done"].includes(status)) {
				return res.status(400).json({ error: "Invalid status" });
			}
			const tasks = await this.taskBoardService.getTasksByStatus(
				status as "todo" | "inProgress" | "done",
			);
			res.json(tasks);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async updateTaskStatus(req: Request, res: Response) {
		try {
			const { uuid } = req.params;
			const { status } = req.body;
			const updatedTask = await this.taskBoardService.updateTaskStatus(
				uuid,
				status,
			);
			res.json(updatedTask);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}
}
