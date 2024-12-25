const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Hàm tạo token
const createToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Hàm tạo refresh token
const createRefreshToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });
};

// Hàm kiểm tra token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

module.exports = { createToken, createRefreshToken, verifyToken };
