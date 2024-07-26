export type ColumnId = "todo" | "inProgress" | "done";

export interface Task {
	uuid: string;
	taskText: string;
	status: ColumnId;
}

export interface Tasks {
	[key: string]: Task[];
}
