import { useState, useRef } from "react";
import "./App.css";

type ColumnId = "todo" | "inProgress" | "done";

interface Tasks {
	[key: string]: string[];
}

function App() {
	const [tasks, setTasks] = useState<Tasks>({
		todo: [],
		inProgress: [],
		done: [],
	});

	const draggedTask = useRef<{ task: string; sourceColumn: ColumnId } | null>(
		null,
	);

	const addTask = (columnId: ColumnId): void => {
		const taskText = prompt("Enter task description:");
		if (taskText) {
			setTasks((prevTasks) => ({
				...prevTasks,
				[columnId]: [...prevTasks[columnId], taskText],
			}));
		}
	};

	const onDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		task: string,
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
					[sourceColumn]: prevTasks[sourceColumn].filter((t) => t !== task),
					[targetColumn]: [...prevTasks[targetColumn], task],
				}));
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
			{tasks[columnId].map((task, index) => (
				<div
					key={index}
					className="bg-gray-700 p-2 rounded cursor-move"
					draggable
					onDragStart={(e) => onDragStart(e, task, columnId)}
					onDragEnd={onDragEnd}>
					{task}
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
