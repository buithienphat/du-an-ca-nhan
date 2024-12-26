const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  createToken,
  createRefreshToken,
  verifyToken,
} = require("../helper/jwtHelper");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    // Get token from cookies

    console.log("req.cookies", req.cookies);

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user by ID from decoded token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, address, gender, password } = req.body;

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Tạo người dùng mới
    const newUser = new User({ name, email, phone, address, gender, password });

    // Lưu người dùng vào database
    await newUser.save();

    // Tạo access token cho người dùng
    const token = createToken({ id: newUser._id });

    res.status(201).json({ message: "Registration successful", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = createToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = createToken({ id: decoded.id });

    res.status(200).json({
      message: "New access token generated",
      accessToken: newAccessToken,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh token expired" });
    }
    res.status(500).json({ error: err.message });
  }
};
