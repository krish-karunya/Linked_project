import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    //  console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Token not exists" });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await User.findOne({ _id: decode.userId }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in Protect Route", error);
    res.status(500).json({ message: error.message });
  }
};
