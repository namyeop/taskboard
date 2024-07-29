import TaskBoardRepository from "../repositories/taskboard.repository";
import Database from "../databases/database";
import { ColumnIds } from "../../types/taskboard";

jest.mock("../databases/database.ts", () => {
	return {
		getInstance: jest.fn().mockReturnValue({
			run: jest.fn(),
			all: jest.fn(),
		}),
	};
});

class MockTaskBoardRepository extends TaskBoardRepository {
	constructor() {
		super(Database.getInstance());
	}
}

describe("TaskBoardRepository", () => {
	let taskBoardRepository: MockTaskBoardRepository;

	beforeEach(() => {
		taskBoardRepository = new MockTaskBoardRepository();
	});

	describe("createTask", () => {
		it("should create a new task", async () => {
			const task = {
				uuid: "123",
				taskText: "Task 1",
				status: ColumnIds.TODO,
			};
			const newTask = await taskBoardRepository.createTask(task);
			expect(newTask).toEqual(task);
		});
	});
});
