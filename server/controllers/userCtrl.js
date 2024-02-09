const User = require("../models/db/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const sendToken = require("../utils/sendToken.js");
// const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const createUser = asyncHandler(async (req, res, next) => {
     const { name, email, password } = req.body;

     try {

          const myCloud = await cloudinary.v2.uploader.upload(req?.body?.avatar, {
               folder: "avatars",
               width: 150,
               crop: "scale",
          });
     
          const user = await User.create({
               name,
               email,
               password,
               avatar: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
               },
          });
     
          sendToken(user, 201, res);

     } catch (err) {
          throw new Error(err);
     };
});

const loginUser = asyncHandler(async (req, res, next) => {
     const { email, password } = req.body;

     try {

          if (!email || !password) return next(new ErrorHandler("Please enter email and password", 400));

          const user = await User.findOne({ email }).select("+password");
          if (!user) return next(new ErrorHandler("Invalid email or password", 401));
          
          const isPasswordMatched = await user.comparePassword(password);
          if (!isPasswordMatched) return next(new ErrorHandler("Invalid email or password", 401));
          
          sendToken(user, 201, res);

     } catch (err) {
          return next(new ErrorHandler(err));
     };
});

const forgotPassword = asyncHandler(async (req, res, next) => {
     
});

const getAllUsers = asyncHandler(async (req, res, next) => {
     const users = await User.find();
     if (!users) return next(new ErrorHandler("Users not found", 400));

     res.status(200).json(findAllUsers);
});

const getUserDetails = asyncHandler(async (req, res, next) => {
     
});

const logoutUser = asyncHandler(async (req, res, next) => {
     
});

const getSingleUser = asyncHandler(async (req, res, next) => {
     
});

const updateProfile = asyncHandler(async (req, res, next) => {

});

const updatePassword = asyncHandler(async (req, res, next) => {

});

const resetPassword = asyncHandler(async (req, res, next) => {

});

const updateUserRole = asyncHandler(async (req, res, next) => {

});

const deleteUser = asyncHandler(async (req, res, next) => {

});

module.exports = { createUser, loginUser, getAllUsers };