const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");
const cors = require("cors");
require('dotenv').config({ path: "config/conf.env" });

const userRoute = require("./routes/routeRoute.js");

const app = express();
const clientPromise = mongoose.connect(process.env.MONGO_URL);

app.use(session({
     secret: process.env.SESSION_SECRET,
     resave: true,
     saveUninitialized: true,
     cookie: { maxAge: 19 * 60000, domain: 'localhost', httpOnly: true },
     store: MongoStore.create({
          mongoUrl: process.env.MONGO_URL,
          dbName: "app",
          clientPromise,
          autoRemove: 'native',
          ttl: 14 * 24 * 60 * 60,
          autoRemoveInterval: 10
     }),
}));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(morgan("dev"));
app.use(cors({
     origin: "http://localhost:5173", 
     credentials: true, 
}));

app.use("/api/v2", userRoute);

module.exports = app;