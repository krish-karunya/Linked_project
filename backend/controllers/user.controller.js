import { User } from "../models/user.model.js";
import { AllowedEditField, validateField } from "../utils/validateField.js";
// import validator from "validator";
import cloudinary from "../utils/cloudinary.js";
import { ConnectionRequest } from "../models/connectionRequest.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = req.user;

    const userProfile = await User.findOne({ _id: user._id }).select(
      "-password"
    );
    console.log(userProfile);

    res.status(200).json({ data: userProfile });
  } catch (error) {
    console.log("Error in getMyProfile controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMySuggestions = async (req, res) => {
  try {
    /**
     * Key Notes take over here is
     * 1. Our profile shouldn't be there in suggestion
     * 2. Our connections Profile shouldn't be there in suggestion
     */

    const suggestedUser = await User.find({
      _id: { $ne: req.user._id, $nin: req.user.connections },
    })
      .select("userName profilePic headline")
      .limit(5);

    // const connectionUser = await ConnectionRequest.find({
    //   receiver: req.user._id,
    // });
    // const suggestedUserResult = suggestedUser.filter((user) =>
    //   connectionUser.find((user1) => user1.receiver !== user._id)
    // );
    // console.log(connectionUser);

    res.status(200).json({ data: suggestedUser });
  } catch (error) {
    console.log("Error in getMySuggestions controller", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const currentUser = req.user;
  console.log("currentUser", currentUser);

  try {
    const {
      name,
      username,
      education,
      password,
      profilePic,
      bannerImg,
      headline,
      location,
      about,
      skill,
      experience,
    } = req.body;

    if (!validateField(req)) {
      return res
        .status(400)
        .json({ message: "Field is not allow you to edit " });
    }
    // if (!validator.isBase64(profilePic) && !validator.isBase64(bannerImg)) {
    //   return res.status(400).json({ message: "Invalid Image URL format" });
    // }

    const updatedProfile = {};

    for (const field of AllowedEditField) {
      if (req.body[field]) {
        updatedProfile[field] = req.body[field];
      }
    }

    if (profilePic) {
      updatedProfile.profilePic = (
        await cloudinary.uploader.upload(profilePic, { folder: "profile" })
      ).secure_url;
    }
    if (bannerImg) {
      updatedProfile.bannerImg = (
        await cloudinary.uploader.upload(bannerImg, { folder: "profile" })
      ).secure_url;
    }

    const user = await User.findByIdAndUpdate(
      { _id: req.user._id },
      updatedProfile,
      { new: true }
    ).select("-password");

    res.status(200).json({ data: user });
  } catch (error) {
    console.log("Error in updateProfile controller", error);
    res.status(500).json({ message: error.message });
  }
};
