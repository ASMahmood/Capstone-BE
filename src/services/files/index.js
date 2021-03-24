const express = require("express");
const mongoose = require("mongoose");
const { gfsMongoose } = require("../../server");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const fileRouter = express.Router();
let gfs;
mongoose.connection.once("open", () => {
  console.log("I'm in ova ere, in da file");
  obj = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
  console.log(obj);
});

module.exports = fileRouter;
