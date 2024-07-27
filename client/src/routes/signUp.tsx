import { createFileRoute } from "@tanstack/react-router";
import SignUp from "../components/singUp";

export const Route = createFileRoute("/signUp")({
	component: SignUp,
});
