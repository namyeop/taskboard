import { useState, useRef, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { Task, ColumnId, Tasks } from "@types/taskboard";

function App() {
	const [tasks, setTasks] = useState<Tasks>({
		todo: [],
		inProgress: [],
		done: [],
	});

	useEffect(() => {
		const socket = io();

		socket.on("connect", () => {});

		return () => {
			socket.disconnect();
		};
	}, []);

	const draggedTask = useRef<{ task: Task; sourceColumn: ColumnId } | null>(
		null,
	);

	const addTask = (columnId: ColumnId): void => {
		const taskText = prompt("Enter task description:");
		if (taskText) {
			const socket = io();
			const newTask = { id: uuidv4(), taskText };
			setTasks((prevTasks) => ({
				...prevTasks,
				[columnId]: [...prevTasks[columnId], newTask],
			}));

			socket.emit("addTask", { taskText, columnId });
		}
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
				const socket = io();
				setTasks((prevTasks) => ({
					...prevTasks,
					[sourceColumn]: prevTasks[sourceColumn].filter(
						(t) => t.id !== task.id,
					),
					[targetColumn]: [...prevTasks[targetColumn], task],
				}));
				socket.emit("moveTask", { task, sourceColumn, targetColumn });
			}
			draggedTask.current = null;
		}
	};

	const deleteTask = (task: Task, columnId: ColumnId) => {
		setTasks((prevTasks) => ({
			...prevTasks,
			[columnId]: prevTasks[columnId].filter((t) => t.id !== task.id),
		}));
	};

	const renderColumn = (columnId: ColumnId, title: string) => (
		<div
			className="bg-gray-800 p-4 rounded-lg space-y-2 w-60"
			onDragOver={onDragOver}
			onDrop={(e) => onDrop(e, columnId)}>
			<h2 className="text-xl font-bold mb-4">{title}</h2>
			{tasks[columnId].map((task, index) => (
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

	return (
		<div className="max-w-6xl mx-auto">
			<h1 className="text-3xl font-semibold mb-6">Taskboard</h1>
			<div id="taskboard" className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{renderColumn("todo", "To Do")}
				{renderColumn("inProgress", "In Progress")}
				{renderColumn("done", "Done")}
			</div>
		</div>
	);
}

export default App;
