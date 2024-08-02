import { createFileRoute } from "@tanstack/react-router";
import SignIn from "../components/signIn";

export const Route = createFileRoute("/signIn")({
	component: SignIn,
});
