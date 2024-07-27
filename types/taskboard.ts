export const ColumnIds = {
	TODO: "todo",
	IN_PROGRESS: "inProgress",
	DONE: "done",
} as const;

export type ColumnId = (typeof ColumnIds)[keyof typeof ColumnIds];

export interface Task {
	uuid: string;
	taskText: string;
	status: ColumnId;
}

export type Tasks = {
	[K in ColumnId]: Task[];
};
