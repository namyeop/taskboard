import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "secret";

export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];
	jwt.verify(token, jwtSecret, (err, decoded) => {
		if (err) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		next();
	});
};
