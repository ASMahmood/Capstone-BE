const express = require("express");
const {
  authenticateUser,
  authorizeUser,
} = require("../../utilities/authTools");
const UserModel = require("./schema");
const multer = require("multer");
const cloudinary = require("../../utilities/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "CAPSTONE",
  },
});
const cloudinaryMulter = multer({ storage: storage });

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.send({ message: "user registered!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await UserModel.findByCredentials(email, password);
    console.log(user);
    if (user) {
      const tokens = await authenticateUser(user);
      res
        .cookie("accessToken", tokens.accessToken, {
          httpOnly: true,
          // secure: true, //set to true when deploy
          // sameSite: "none", //set to none when deploy
        })
        .cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          // secure: true, //set to true when deploy
          // sameSite: "none", //set to none when deploy
        })
        .send({ message: "logged in" });
    } else {
      res.status(404).send({ message: "No user found!" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get("/", authorizeUser, async (req, res, next) => {
  try {
    const allUsers = await UserModel.find().populate("rooms");
    res.send(allUsers);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get("/me", authorizeUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get("/:id", authorizeUser, async (req, res, next) => {
  try {
    const singleUser = await UserModel.findById(req.params.id).populate(
      "rooms"
    );
    if (singleUser) {
      res.send(singleUser);
    } else {
      res.status(404).send({ message: "No user with this id exists" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.put("/:id", authorizeUser, async (req, res, next) => {
  try {
    if (req.user._id === req.params.id) {
      const editedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { runValidators: true, new: true }
      );
      if (editedUser) {
        res.send(editedUser);
      } else {
        res.status(404).send({ message: "No user with this id exists" });
      }
    } else {
      res.status(401).send({ message: "This is not your account" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.put(
  "/me/upload",
  authorizeUser,
  cloudinaryMulter.single("ProfilePic"),
  async (req, res, next) => {
    try {
      const addedIMG = await UserModel.findByIdAndUpdate(
        req.user._id,
        { profilePic: req.file.path },
        { runValidators: true, new: true }
      );
      res.send(addedIMG);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

userRouter.put(
  "/:id/uploadOnlyOnce",
  cloudinaryMulter.single("ProfilePic"),
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (user.profilePic) {
        res.send({ message: "This account already has a profile picture." });
      } else {
        const addedIMG = await UserModel.findByIdAndUpdate(
          req.params.id,
          { profilePic: req.file.path },
          { runValidators: true, new: true }
        );
        res.send(addedIMG);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = userRouter;
