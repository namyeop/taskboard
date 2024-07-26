export type ColumnId = "todo" | "inProgress" | "done";

export interface Task {
	id: string;
	taskText: string;
}

export interface Tasks {
	[key: string]: Task[];
}
