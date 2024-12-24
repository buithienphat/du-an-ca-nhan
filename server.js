const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const productRoutes = require("./routes/productRoutes");

const app = express();

// Sử dụng cors với cấu hình mặc định (cho phép tất cả CORS)
app.use(cors());

// Middleware để xử lý JSON
app.use(express.json());

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

// Khởi chạy server
const PORT = process.env.PORT || 50000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
