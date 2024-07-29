import { Router } from "express";
import http from "http";
import Database from "../databases/database";
import { TaskBoardController } from "../controllers/taskboardController";
import { UserController } from "../controllers/userController";
import UserRepository from "../repositories/user.repository";
import TaskBoardRepository from "../repositories/taskboard.repository";
import { refreshToken, verifyToken } from "../middlewares/authMiddleware";

const createRouter = (server: http.Server) => {
	const router = Router();

	const userRepository = new UserRepository();
	const taskBoardRepository = new TaskBoardRepository(Database.getInstance());

	const taskBoardController = new TaskBoardController(
		taskBoardRepository,
		server,
	);
	const userController = new UserController(userRepository);

	router.get(
		"/",
		verifyToken,
		taskBoardController.getAllTasks.bind(taskBoardController),
	);
	router.post("/signup", userController.createUser.bind(userController));
	router.post("/login", userController.loginUser.bind(userController));
	router.post("/refreshToken", refreshToken);

	return router;
};

export default createRouter;
