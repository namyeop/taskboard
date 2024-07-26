import { Request, Response } from "express";

export const getTaskboard = async (req: Request, res: Response) => {
	res.send("Hello World!");
};

export const createTask = async (req: Request, res: Response) => {
	res.send("Task created!");
};
