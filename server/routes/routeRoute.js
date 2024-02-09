const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../controllers/userCtrl.js");
const { authMiddleware, authRoles } = require("../middlewares/auth.js");

router.post("/register", createUser);
router.post("/login", loginUser);

module.exports = router;