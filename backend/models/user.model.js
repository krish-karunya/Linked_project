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
    education: [
      {
        fieldOfStudy: String,
        startYear: String,
        endYear: String,
      },
    ],
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
    experience: [
      {
        companyName: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    connections: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
