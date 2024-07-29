import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/config";

const jwtSecret = jwtConfig.jwtSecret;
const jwtRefreshSecret = jwtConfig.jwtRefreshSecret;

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
	jwt.verify(token, jwtSecret, (err) => {
		if (err) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		next();
	});
};

export const refreshToken = (req: Request, res: Response) => {
	const { refreshToken } = req.body;
	if (!refreshToken) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	jwt.verify(
		refreshToken,
		jwtRefreshSecret,
		(err: jwt.VerifyErrors | null, user: any) => {
			if (err) {
				return res.status(401).json({ error: "Unauthorized" });
			}

			const token = jwt.sign({ username: user.username }, jwtSecret, {
				expiresIn: "1h",
			});

			res.json({ token });
		},
	);
};
