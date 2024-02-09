const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
let userSchema = new mongoose.Schema({
     name:{
          type:String,
          required: [true, "please enter your name"],
     },
     email:{
          type:String,
          required:true,
          unique:true,
     },

     password: {
          type: String,
          required: [true, "please enter your password"],
          minLength: [8, "password should have atleast 8 chars"],
          select: false,
          required: function () {
               return !this.googleId;
          },
     },

     avatar: {
          public_id: String,
          url: String,
     },

     role: {
          type: String,
          enum: ["user", "admin", "superadmin"],
          default: "user",
     },

     createdAt: {
          type: Date,
          default: Date.now(),
     },

     provider: {
          type: String,
          enum: ["local", "google"],
          default: "local",
     },

     resetPasswordToken: String,
     resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
     if (!this.isModified("password")) {
          next();
     };

     this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
     return jwt.sign({ id: this._id }, "1234567890", { expiresIn: "2h" });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
     if (this.googleId) {
          return false;
     };

     return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = async function () {
     const resetToken = crypto.randomBytes(20).toString("hex");

     this.resetPasswordExpire = crypto.createHash("sha256").update(resetToken).digest("hex");
     this.resetPasswordToken = Date.now() + 15 * 60 * 1000

     return resetToken;
};

userSchema.statics.findOrCreateGoogleUser = async function (googleId, email, name) {
     let user = await this.findOne({ googleId });
   
     if (!user) {
          user = await this.create({
               googleId,
               email,
               name,
          });
     };
   
     return user;
};


//Export the model
module.exports = mongoose.model('User', userSchema);