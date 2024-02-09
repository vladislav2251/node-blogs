const ErrorHandler = require("../utils/errorHandler.js");

module.exports = (err, req, res, next) => {
     err.statusCode = err.statusCode || 500;
     err.message = err.message || "Invalid server error";

     if (err.name === "CastError") {
          const message = `Resource not found. Invalid: ${err.path}`;
          err = new ErrorHandler(message, 400);
     };
sd
     if (err.code === 11000) {
          const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
          err = new ErrorHandler(message, 400);
     };

     if (err.code === "JsonWebTokenError") {
          const message = 'JWT Error';
          err = new ErrorHandler(message, 400);
     };

     if (err.code === "JsonWebTokenError") {
          const message = 'JWT is Expired';
          err = new ErrorHandler(message, 400);
     };

     res.status(err.statusCode).json({
          success: false,
          message: err.message,
     });
};