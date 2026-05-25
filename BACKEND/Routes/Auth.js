const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../Controllers/authController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);  // protected

module.exports = router;