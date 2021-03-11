const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  profilePic: {
    type: String,
  },
  associates: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  rooms: [{ type: Schema.Types.ObjectId, ref: "Rooms" }],
});

UserSchema.pre("save", async function (next) {
  const user = this;
  const plainPW = user.password;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPW, 8);
  }
  next();
});

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else return null;
  } else {
    return null;
  }
};

UserSchema.statics.addRoomToUser = async function (userId, roomId) {
  try {
    const updatedUser = await this.findByIdAndUpdate(userId, {
      $addToSet: { rooms: roomId },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = model("user", UserSchema);
