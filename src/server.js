const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const http = require("http");

const createSocketServer = require("./socket");
const usersRoute = require("./services/users");
const roomsRoute = require("./services/rooms");
const fileRoute = require("./services/files");
const catchAllHandler = require("./utilities/errorHandling");

const port = process.env.PORT;
const server = express();
const httpServer = http.createServer(server);
createSocketServer(httpServer);

const whitelist = [
  "http://localhost:3000",
  "http://localhost:300/login",
  "http://localhost:9001",
  "https://capstone-fe-abdul.herokuapp.com",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

server.use(cors(corsOptions));
server.use(cookieParser());
server.use(express.json());
server.set("view engine", "ejs");

server.use("/users", usersRoute);
server.use("/rooms", roomsRoute);
server.use("/files", fileRoute);
server.use(catchAllHandler);

mongoose
  .connect(process.env.MONGO_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    httpServer.listen(port, () => {
      console.log("Server cooking meth worth £", port);
    })
  );
