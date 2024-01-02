const mongoose = require("mongoose");
const blogsSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    content: String,
    image: String,
    imageId: String,
    blogger: String,
    category: {
      type: String,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const Blogs = mongoose.model("Blog", blogsSchema);

module.exports = Blogs;
