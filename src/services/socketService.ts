// socketService.ts
import { Server as SocketIOServer } from "socket.io";
import { io } from "../app";

export class SocketService {
	private static instance: SocketService;
	private io: SocketIOServer;

	private constructor(io: SocketIOServer) {
		this.io = io;
	}

	public static initialize(io: SocketIOServer): void {
		if (!SocketService.instance) {
			SocketService.instance = new SocketService(io);
		}
	}

	public static getInstance(): SocketService {
		if (!SocketService.instance) {
			SocketService.instance = new SocketService(io);
		}
		return SocketService.instance;
	}

	public getIO(): SocketIOServer {
		return this.io;
	}
}
