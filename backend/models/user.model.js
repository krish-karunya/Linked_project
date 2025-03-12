import mongoose from "mongoose";
import { DEFAULT_USER_IMG } from "../utils/constant.js";
console.log(DEFAULT_USER_IMG);

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      Required: [true, "Input Value is Required"],
      unique: true,
    },
    email: {
      type: String,
      Required: [true, "Input Value is Required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    education: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Education",
      default: [],
    },
    password: {
      type: String,
      Required: [true, "Input Value is Required"],
      minLength: [6, "Minimum Length Should be at 6 character"],
    },

    profilePic: {
      type: String,
      default: DEFAULT_USER_IMG,
    },
    bannerImg: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "LinkedIn User",
    },
    location: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    skill: {
      type: [String],
      default: [],
    },
    experience: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Experience",
      default: [],
    },
    connections: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
