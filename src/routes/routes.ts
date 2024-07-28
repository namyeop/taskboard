import { Router } from "express";
import http from "http";
import { TaskBoardController } from "../controllers/taskboardController";
import { UserController } from "../controllers/userController";

const createRouter = (server: http.Server) => {
	const router = Router();
	const taskBoardController = new TaskBoardController(server);
	const userController = new UserController();

	router.get("/", taskBoardController.getAllTasks.bind(taskBoardController));
	router.post("/signup", userController.createUser.bind(userController));
	router.post("/login", userController.loginUser.bind(userController));

	return router;
};

export default createRouter;
