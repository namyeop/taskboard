import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { Task, ColumnId, Tasks, ColumnIds } from "../../../types/taskboard";
import SignIn from "./signIn";
import getTasks from "../services/getTasks";

const TaskBoard: React.FC = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [tasks, setTasks] = useState<Tasks>({
		[ColumnIds.TODO]: [],
		[ColumnIds.IN_PROGRESS]: [],
		[ColumnIds.DONE]: [],
	});

	const socketRef = useRef(null);
	const draggedTask = useRef<{ task: Task; sourceColumn: ColumnId } | null>(
		null,
	);

	useEffect(() => {
		const socket = io("http://localhost:3000");
		socketRef.current = socket;

		socket.on("connect", () => {
			console.log("Connected to server");
		});

		getTasks(setTasks);

		return () => {
			socket.disconnect();
		};
	}, []);

	const addTask = (columnId: ColumnId): void => {
		const taskText = prompt("Enter task description:");
		if (taskText) {
			const uuid = uuidv4();
			const newTask = { uuid, taskText, status: columnId };
			setTasks((prevTasks) => ({
				...prevTasks,
				[columnId]: [...prevTasks[columnId], newTask],
			}));
			socketRef.current.emit("createTask", {
				uuid,
				taskText,
				status: columnId,
			});
		}
	};

	const deleteTask = (task: Task, columnId: ColumnId) => {
		setTasks((prevTasks) => ({
			...prevTasks,
			[columnId]: prevTasks[columnId].filter((t) => t.uuid !== task.uuid),
		}));
		socketRef.current.emit("deleteTask", {
			uuid: task.uuid,
		});
	};

	const onDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		task: Task,
		sourceColumn: ColumnId,
	): void => {
		draggedTask.current = { task, sourceColumn };
		e.currentTarget.style.opacity = "0.5";
	};

	const onDragEnd = (e: React.DragEvent<HTMLDivElement>): void => {
		e.currentTarget.style.opacity = "1";
	};

	const onDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
		e.preventDefault();
	};

	const onDrop = (
		e: React.DragEvent<HTMLDivElement>,
		targetColumn: ColumnId,
	): void => {
		e.preventDefault();
		if (draggedTask.current) {
			const { task, sourceColumn } = draggedTask.current;
			if (sourceColumn !== targetColumn) {
				setTasks((prevTasks) => ({
					...prevTasks,
					[sourceColumn]: prevTasks[sourceColumn].filter(
						(t) => t.uuid !== task.uuid,
					),
					[targetColumn]: [...prevTasks[targetColumn], task],
				}));
				socketRef.current.emit("updateTask", {
					uuid: task.uuid,
					status: targetColumn,
				});
			}
			draggedTask.current = null;
		}
	};

	const renderColumn = (columnId: ColumnId, title: string) => (
		<div
			className="bg-gray-800 p-4 rounded-lg space-y-2 w-60"
			onDragOver={onDragOver}
			onDrop={(e) => onDrop(e, columnId)}>
			<h2 className="text-xl font-bold mb-4">{title}</h2>
			{tasks[columnId] &&
				tasks[columnId].map((task, index) => (
					<div
						key={index}
						className="bg-gray-700 p-2 rounded cursor-move"
						draggable
						onDragStart={(e) => onDragStart(e, task, columnId)}
						onDragEnd={onDragEnd}>
						<span>{task.taskText}</span>
						<button
							onClick={() => deleteTask(task, columnId)}
							className="bg-red-500 text-white px-2 py-1 rounded ml-2">
							Delete
						</button>
					</div>
				))}
			<button
				onClick={() => addTask(columnId)}
				className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
				Add Task
			</button>
		</div>
	);

	if (!isLoggedIn) {
		return <SignIn setIsLoggedIn={setIsLoggedIn} />;
	}

	return (
		<div data-testid="taskboard" className="max-w-6xl mx-auto">
			<h1 className="text-3xl font-semibold mb-6">Taskboard</h1>
			<div id="taskboard" className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{renderColumn(ColumnIds.TODO, "To Do")}
				{renderColumn(ColumnIds.IN_PROGRESS, "In Progress")}
				{renderColumn(ColumnIds.DONE, "Done")}
			</div>
		</div>
	);
};

export default TaskBoard;
