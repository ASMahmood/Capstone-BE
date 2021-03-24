const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const { gfsMongoose } = require("../../server");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

const fileRouter = express.Router();

let gfs;
mongoose.connection.once("open", () => {
  console.log("I'm in ova ere, in da file");
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "files",
  });
  console.log(gfs);
});

const storage = new GridFsStorage({
  url: process.env.MONGO_ATLAS,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "files",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({
  storage,
});

fileRouter.post("/upload", upload.single("file"), (req, res) => {
  // res.json({file : req.file})
  res.redirect("/files/");
});

fileRouter.get("/", (req, res) => {
  if (!gfs) {
    console.log("some error occured, check connection to db");
    res.send("some error occured, check connection to db");
    process.exit(0);
  }
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.send("failure");
    } else {
      const f = files
        .map((file) => {
          if (
            file.contentType === "image/png" ||
            file.contentType === "image/jpeg"
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
          return file;
        })
        .sort((a, b) => {
          return (
            new Date(b["uploadDate"]).getTime() -
            new Date(a["uploadDate"]).getTime()
          );
        });

      return res.send("success?");
    }

    // return res.json(files);
  });
});

module.exports = fileRouter;