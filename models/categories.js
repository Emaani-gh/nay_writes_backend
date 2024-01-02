const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: String,
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
