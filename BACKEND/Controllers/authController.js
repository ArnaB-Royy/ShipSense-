const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");

// ── REGISTER ──────────────────────────────
const register = async (req, res) => {
  const { Name, Email, Password, Role, Company, adminSecret } = req.body;

  if (!Name || !Email || !Password || !Role) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const exists = await User.findOne({ Email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    // Admin secret check
    if (Role === "admin") {
      if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ success: false, message: "Invalid admin secret key." });
      }
    }

    // Password is hashed by the pre-save hook in User model
    const user = new User({ Name, Email, Password, Role, Company: Company || null });
    await user.save();

    return res.status(201).json({ success: true, message: "Registered successfully. Please login." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── LOGIN ─────────────────────────────────
const login = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email." });
    }

    if (!user.IsActive) {
      return res.status(403).json({ success: false, message: "Account is inactive. Contact support." });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,       // set true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      message: "Logged in successfully.",
      role: user.Role,
      user: {
        _id: user._id,
        Name: user.Name,
        Email: user.Email,
        Role: user.Role,
        Company: user.Company,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── LOGOUT ────────────────────────────────
const logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: false, sameSite: "strict", path: "/" });
    return res.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET LOGGED IN USER ────────────────────
const getMe = async (req, res) => {
  try {
    return res.json({ success: true, user: req.user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, logout, getMe };