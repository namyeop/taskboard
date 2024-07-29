import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { SocketService } from "./services/socketService";
import createRouter from "./routes/routes";
import Database from "./databases/database";

const app = express();
const server = http.createServer(app);
const db = Database.getInstance();
const router = createRouter(server, db);

app.use(express.json());

const corsOptions = {
	origin: "http://localhost:5173",
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/", router);

const port = 3000;

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
