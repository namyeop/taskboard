import sqlite3 from "sqlite3";
import { Task } from "@types-taskboard/taskboard";
import Database from "../databases/database";

export default class TaskBoardRepository {
	private db: sqlite3.Database;

	constructor(db: sqlite3.Database) {
		this.db = db;
	}

	async createTask(task: Omit<Task, "id">): Promise<Task> {
		return new Promise((resolve, reject) => {
			const { uuid, taskText, status } = task;
			const query =
				"INSERT INTO taskboard (uuid, taskText, status) VALUES (?, ?, ?)";
			this.db.run(query, [uuid, taskText, status], function (err) {
				if (err) {
					reject(err);
				} else {
					resolve({ ...task });
				}
			});
		});
	}

	async getTaskByUuid(uuid: string): Promise<Task | null> {
		return new Promise((resolve, reject) => {
			const query = "SELECT * FROM taskboard WHERE uuid = ?";
			this.db.get(query, [uuid], (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row ? (row as Task) : null);
				}
			});
		});
	}

	async updateTaskStatus(
		uuid: string,
		status: Task["status"],
	): Promise<Task | null> {
		return new Promise((resolve, reject) => {
			const query = "UPDATE taskboard SET status = ? WHERE uuid = ?";
			this.db.run(query, [status, uuid], async (err) => {
				if (err) {
					reject(err);
				} else {
					const updatedTask = await this.getTaskByUuid(uuid);
					resolve(updatedTask);
				}
			});
		});
	}

	async getAllTasks(): Promise<Task[]> {
		return new Promise((resolve, reject) => {
			const query = "SELECT * FROM taskboard";
			this.db.all(query, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows as Task[]);
				}
			});
		});
	}

	async getTasksByStatus(status: Task["status"]): Promise<Task[]> {
		return new Promise((resolve, reject) => {
			const query = "SELECT * FROM taskboard WHERE status = ?";
			this.db.all(query, [status], (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows as Task[]);
				}
			});
		});
	}

	async deleteTask(uuid: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const query = "DELETE FROM taskboard WHERE uuid = ?";
			this.db.run(query, [uuid], (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}
