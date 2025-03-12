import { User } from "../models/user.model.js";
import validator from "validator";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All field is Required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email Format" });
    }
    const isExistingUser = await User.findOne({ userName });
    if (isExistingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const isEmail = await User.findOne({ email });

    if (isEmail) {
      return res.status(400).json({ message: "Email ID Already Exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password Length Should be greater than 6" });
    }

    // Hash the password :
    const genSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, genSalt);

    // creating a user :
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    // Send JWT Token :
    const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent XSS attack
      sameSite: true, // prevent from csrf attack
    });

    res.status(201).json({
      message: `Hi ${newUser.userName} ,You SignUp Successfully`,
      data: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credential" });
    }

    // Verify the password :
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credential" });
    }

    // Send JWT Token :
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent XSS attack
      sameSite: true, // prevent from csrf attack
    });

    res.status(200).json({
      message: "Logged In Successfully",
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the token from the cookies
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict", // CSRF protection
    });

    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: error.message });
  }
};
