require("dotenv").config();
const express = require("express");
const apiRouter = require("./routes");
const cors = require("cors");
const { Server } = require("socket.io");
const io = new Server();
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use("/api/v1", apiRouter);
app.use("/public/uploads", express.static("./public/uploads"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
io.on("connection", (socket) => {
  console.log("a user connection: ", socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.disconnect();
  });
  socket.on("chat message", (data) => {
    console.log("data received from client: ", data);
    io.emit("chat message", data);
  });
});
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
