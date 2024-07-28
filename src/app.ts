import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { SocketService } from "./services/socketService";
import createRouter from "./routes/routes";

const app = express();
const server = http.createServer(app);

app.use(express.json());

const corsOptions = {
	origin: "http://localhost:5173",
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const router = createRouter(server);

app.use("/", router);

const port = 3000;

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
