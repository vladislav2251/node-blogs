const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler.js");
const User = require("../models/db/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");

const authMiddleware = asyncHandler(async (req, res, next) => {

     let token;

     if (req?.headers?.authorization?.startsWith("Bearer")) {
          token = req.headers.authorization.split(" ")[1];
      
          try {
      
               if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const user = await User.findById(decoded?.id);
               
                    req.user = user;
                    next();
               };
      
          } catch (error) {
               throw new Error("Not authorized token expired, please login again");
          };

     } else {
          throw new Error("There is no token attached to header");
     };

     // const { token } = req.cookies;
     // if (!token) return next(new ErrorHandler("Please login to access", 401));

     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
     // req.user = await User.findById(decoded.id);
     // next();

});

const authRoles = ( ...roles ) => {
     return (req, res, next) => {

          if (!roles.includes(req.user.role)) {
               return next(new ErrorHandler(`Role ${req.user.role} is not allowed`, 403));
          };

          next();

     };
};

module.exports = { authMiddleware, authRoles };