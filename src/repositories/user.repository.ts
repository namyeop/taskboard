import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import Database from "../databases/database";

export default class UserRepository {
	private db: sqlite3.Database;

	constructor(db: sqlite3.Database) {
		this.db = db;
	}

	public registerUser(username: string, password: string): Promise<void> {
		return new Promise((resolve, reject) => {
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) {
					reject(err);
				} else {
					this.db.run(
						"INSERT INTO users (username, password) VALUES (?, ?)",
						[username, hash],
						(err: Error | null) => {
							if (err) {
								reject(err);
							} else {
								resolve();
							}
						},
					);
				}
			});
		});
	}

	public loginUser(username: string, password: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) {
					reject(err);
				} else {
					this.db.get(
						"SELECT * FROM users WHERE username = ? AND password = ?",
						[username, hash],
						(err: Error | null, row: any) => {
							if (err) {
								reject(err);
							} else {
								resolve(row !== undefined);
							}
						},
					);
				}
			});
		});
	}
}
