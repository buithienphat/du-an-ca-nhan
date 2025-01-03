const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://client-amber-tau.vercel.app"], // Các domain được phép
    credentials: true, // Cho phép gửi cookie
  })
);

// Middleware để xử lý JSON
app.use(express.json());

app.use(cookieParser());

// Kết nối tới MongoDB
const DB = process.env.MONGO_DB;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Sử dụng Routes
app.use("/products", productRoutes);
app.use("/user", userRoutes);

// Khởi chạy server
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
