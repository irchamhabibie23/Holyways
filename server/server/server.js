require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const apiRouter = require("./routes");
const socketFund = require("./socket/fund");

const PORT = 5000;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", //client domain/url
  },
});

app.use(express.json());
app.use(cors());
app.use("/api/v1", apiRouter);
app.use("/public/uploads", express.static("./public/uploads"));

const fundNameSpace = io.of("/fund").on("connection", (socket) => {
  socketFund.respond(fundNameSpace, socket);
});

fundNameSpace.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    const token = socket.handshake.auth.token;
    console.log(token);
    next();
  } else {
    next(new Error("invalid"));
  }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
