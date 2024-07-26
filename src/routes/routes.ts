import { Router } from "express";
import { getTaskboard } from "../controllers/taskboard";

const router = Router();
router.get("/", getTaskboard);

export default router;
