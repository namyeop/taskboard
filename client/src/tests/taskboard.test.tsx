import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { userEvent } from "@vitest/browser/context";
import TaskBoard from "../components/taskboard";

const mockData = {
	token: "fake-token",
	refreshToken: "fake-refresh-token",
};

vi.mock("axios", async () => {
	const originalModule = await vi.importActual("axios");
	return {
		...originalModule,
		post: vi.fn().mockResolvedValue({
			data: mockData,
		}),
	};
});

vi.mock("../components/taskboard", async () => {
	const originalModule = await vi.importActual("../components/taskboard");
	return {
		__esModule: true,
		...originalModule,
		io: {
			connect: vi.fn(),
		},
		getTasks: vi.fn().mockResolvedValue([
			{
				uuid: "123",
				taskText: "Task 1",
				status: "TODO",
			},
		]),
	};
});

describe("Taskboard", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("successful login", async () => {
		render(<TaskBoard />);

		const usernameInput = screen.getByLabelText(/username/i);
		const passwordInput = screen.getByLabelText(/password/i);
		const submitButton = screen.getByRole("button", { name: /login/i });

		await userEvent.type(usernameInput, "testuser");
		await userEvent.type(passwordInput, "password123");

		await userEvent.click(submitButton);

		// expect(localStorage.getItem("token")).toBe("fake-token");
		// expect(localStorage.getItem("refreshToken")).toBe("fake-refresh-token");

		expect(screen.getByText("Taskboard")).toBeInTheDocument();
	});
});
