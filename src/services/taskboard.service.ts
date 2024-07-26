import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
	db.run(
		"CREATE TABLE taskboard (id INTEGER PRIMARY KEY AUTOINCREMENT, uuid TEXT, taskText TEXT, status TEXT)",
	);
});

export const createTask = (
	uuid: string,
	taskText: string,
	status: string,
): Promise<any[]> => {
	return new Promise((resolve, reject) => {
		db.run(
			"INSERT INTO taskboard (uuid, taskText, status) VALUES (?, ?, ?)",
			[taskText, status, uuid],
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve([]);
				}
			},
		);
	});
};

export const readTasks = (uuid: string): Promise<any[]> => {
	return new Promise((resolve, reject) => {
		db.run(
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
};

export const updateTask = (
	uuid: string,
	taskText: string,
	status: string,
): Promise<any[]> => {
	return new Promise((resolve, reject) => {
		db.run(
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
};

export const deleteTask = (uuid: string): Promise<any[]> => {
	return new Promise((resolve, reject) => {
		db.run(
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
};
