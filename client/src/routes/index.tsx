import { createFileRoute } from "@tanstack/react-router";
import TaskBoard from "../components/taskboard";

export const Route = createFileRoute("/")({
	component: TaskBoard,
});
