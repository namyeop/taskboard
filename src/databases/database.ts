// src/database/Database.ts
import sqlite3 from "sqlite3";
import { Task } from "@types-taskboard/taskboard";

class Database {
	private static instance: sqlite3.Database;

	private constructor() {}

	public static getInstance(): sqlite3.Database {
		if (!Database.instance) {
			Database.instance = new sqlite3.Database(":memory:");
			Database.initializeDatabase();
		}
		return Database.instance;
	}

	private static initializeDatabase() {
		Database.instance.serialize(() => {
			Database.instance.run(
				"CREATE TABLE IF NOT EXISTS taskboard (id INTEGER PRIMARY KEY AUTOINCREMENT, uuid TEXT, taskText TEXT, status TEXT)",
			);
			Database.instance.run(
				"CREATE INDEX IF NOT EXISTS idx_uuid ON taskboard (uuid)",
			);

			Database.instance.run(
				"CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)",
			);
			Database.instance.run(
				"CREATE INDEX IF NOT EXISTS idx_username ON users (username)",
			);
		});
	}
}

export default Database;
