const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const usersRouter = require("./src/routers/users");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(usersRouter);
app.use(express.static(__dirname + "/uploads"));

const { PORT = 3004 || process.env.PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});

const server = app.listen(PORT);

const httpServer = http.createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

require("./src/socket/consumer")(io);

module.exports = app;
