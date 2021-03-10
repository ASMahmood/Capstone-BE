const jwt = require("jsonwebtoken");
const UserModel = require("../services/users/schema");

const authorizeUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const decoded = await verifyAccessToken(accessToken);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new Error();
    }
    req.user = user;
  } catch (error) {
    console.log(error);
    const err = new Error("Please Authenticate!");
    next(err);
  }
};

const generateJWTAccess = async (payload) => {
  try {
    const accessToken = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1d",
    });
    if (!accessToken) {
      throw new Error();
    }
    return accessToken;
  } catch (error) {
    console.log(error);
    const err = new Error("Failed to generate access token");
    next(err);
  }
};

const generateJWTRefresh = async (payload) => {
  try {
    const refreshToken = await jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    if (!refreshToken) {
      throw new Error();
    }
    return refreshToken;
  } catch (error) {
    console.log(error);
    const err = new Error("Failed to generate access token");
    next(err);
  }
};

const verifyAccessToken = async (token) => {
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decodedToken) {
      throw new Error();
    }
    return decodedToken;
  } catch (error) {
    console.log(error);
    const err = new Error("Failed to generate access token");
    next(err);
  }
};

const verifyRefreshToken = async (token) => {
  try {
    const decodedToken = await jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );
    if (!decodedToken) {
      throw new Error();
    }
    return decodedToken;
  } catch (error) {
    console.log(error);
    const err = new Error("Failed to generate access token");
    next(err);
  }
};

module.exports = { authorizeUser };
