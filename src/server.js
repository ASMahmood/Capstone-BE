const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const catchAllHandler = require("./utilities/errorHandling");

const port = process.env.PORT;
const server = express();

server.use(cors());
server.use(cookieParser());
server.use(express.json());

server.use(catchAllHandler);

mongoose
  .connect(process.env.MONGO_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Server cooking meth worth £", port);
    })
  );
