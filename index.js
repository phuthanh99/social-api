const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const commentRoute = require("./routes/comment");
const seacrchRoute = require("./routes/search");
const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/multer");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const port = process.env.PORT || 8000;

mongoose.connect(
	process.env.MONGO_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (!err) {
			console.log("MongoDB Connection Succeeded.");
		} else {
			console.log("Error in DB connection");
		}
	}
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(cors());

const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/comment", commentRoute);
app.use("/api/search", seacrchRoute);

// set socketIo

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

let users = [];

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId });
};

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
	//when ceonnect
	console.log("a user connected.");

	//take userId and socketId from user
	socket.on("addUser", (userId) => {
		addUser(userId, socket.id);
	});
	console.log(users);

	//send and get message
	socket.on("sendMessage", ({ senderId, receiverId, text }) => {
		const user = getUser(receiverId);
		if (user) {
			io.to(user.socketId).emit("getMessage", {
				senderId,
				text,
			});
		}
	});

	//when disconnect
	socket.on("disconnect", () => {
		console.log("a user disconnected!");
		removeUser(socket.id);
	});
});

server.listen(port, () => {
	console.log(
		`Backend server is running, listening on port http://localhost:${port}`
	);
});
