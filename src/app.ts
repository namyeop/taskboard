import express from "express";
import router from "./routes/routes";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.use("/", router);

io.on("connection", (socket) => {});

export { io };

const port = 3000;

app.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});
