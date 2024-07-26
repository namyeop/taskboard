import sqlite3 from "sqlite3";

export default class TaskBoardRepository {
	private db: sqlite3.Database;

	constructor() {
		this.db = new sqlite3.Database(":memory:");
		this.initializeDatabase();
	}

	private initializeDatabase() {
		this.db.serialize(() => {
			this.db.run(
				"CREATE TABLE taskboard (id INTEGER PRIMARY KEY AUTOINCREMENT, uuid TEXT, taskText TEXT, status TEXT)",
			);
			this.db.run("CREATE INDEX idx_uuid ON taskboard (uuid)");
		});
	}

	public createTask(
		uuid: string,
		taskText: string,
		status: string,
	): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.run(
				"INSERT INTO taskboard (uuid, taskText, status) VALUES (?, ?, ?)",
				[uuid, taskText, status],
				(err: Error | null) => {
					if (err) {
						reject(err);
					} else {
						resolve([]);
					}
				},
			);
		});
	}

	public readTask(uuid: string): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.all(
				"SELECT * FROM taskboard WHERE uuid = ?",
				[uuid],
				(err: Error | null, rows: any[]) => {
					if (err) {
						reject(err);
					} else {
						resolve(rows);
					}
				},
			);
		});
	}

	public updateTask(
		uuid: string,
		taskText: string,
		status: string,
	): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.run(
				"UPDATE taskboard SET taskText = ?, status = ? WHERE uuid = ?",
				[taskText, status, uuid],
				(err: Error | null) => {
					if (err) {
						reject(err);
					} else {
						resolve([]);
					}
				},
			);
		});
	}

	public deleteTask(uuid: string): Promise<any[]> {
		return new Promise((resolve, reject) => {
			this.db.run(
				"DELETE FROM taskboard WHERE uuid = ?",
				[uuid],
				(err: Error | null) => {
					if (err) {
						reject(err);
					} else {
						resolve([]);
					}
				},
			);
		});
	}
}
