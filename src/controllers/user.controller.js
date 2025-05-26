import { User } from "../schema/user.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const checkUsername = asyncHandler(async (req, res) => {
    const { username } = req.body;

    console.log(username)

    if (!username) {
        throw new ApiError("Please enter the username", 404);
    }

    const checkUsername = await User.findOne({ username });

    if (checkUsername) {
        throw new ApiError("Username already exist", 400);
    }

    return res.status(200).json(new ApiResponse("Username can be used", 200));
});

export const checkOldPassword = asyncHandler(async (req, res) => {
    const { oldPassword, username } = req.body;

    if (!oldPassword || !username) {
        throw new ApiError("Please enter the password and username", 400);
    }

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError("Username doesnot exist", 400);
    }

    const checkPassword = user.isPasswordCorrect(oldPassword);

    if (!checkPassword) {
        throw new ApiError("Wrong password input", 401);
    }

    return res.status(200).json(new ApiResponse("Username can be used", 200));
});

export const userController = asyncHandler(async (req, res) => {
    const {
        username,
        password,
        profession,
        companyName,
        address,
        country,
        state,
        subscription,
        newsletter,
    } = req.body;

    if ([username, profession, address, country, state, subscription].some(ele => typeof ele !== "string" || ele.trim() === "")) {
        throw new ApiError("Please fill all the details", 400);
    }

    if (profession === "entrepreneur" && !companyName) {
        throw new ApiError("Company name is required for entrepreneurs", 400);
    }

    if (!req.file) {
        throw new ApiError("Profile Image not found", 400);
    }

    let filePath = req.file.path;
    let imageUrl;

    try {
        const imageRes = await uploadOnCloudinary(filePath);
        await fs.promises.unlink(filePath);
        imageUrl = imageRes.url;
    } catch (error) {
        throw new ApiError("Error While uploading the image", 500);
    }

    const userData = {
        username,
        profilePicture: imageUrl,
        profession,
        companyName,
        address,
        country,
        state,
        subscription,
        newsletter,
    };

    if (password) {
        userData.password = password;
    }
    const existingUser = await User.findOne({ username });

    let user;
    if (existingUser) {
        user = await User.findByIdAndUpdate(existingUser._id, userData, { new: true });
        res.status(200).json(new ApiResponse("User updated successfully", 200, user));
    } else {
        user = await User.create(userData);
        res.status(201).json(new ApiResponse("User created successfully", 201, user));
    }
});
