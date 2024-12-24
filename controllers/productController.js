const Product = require("../models/Product");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
  try {
    const { name, quantity, price, original_price, image } = req.body;

    // Tạo slug từ tên sản phẩm
    const slug = slugify(name, { lower: true, strict: true });

    // Kiểm tra xem slug có bị trùng không
    const existingProductBySlug = await Product.findOne({ slug });
    if (existingProductBySlug) {
      return res.status(400).json({ message: "Slug already exists." });
    }

    // Tạo sản phẩm mới nếu slug không bị trùng
    const product = new Product({ ...req.body, slug });

    await product.save();
    res.status(201).json({
      message: "Product created successfully.",
      success: true,
      product: product,
    });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: 200,
      success: true,
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};
