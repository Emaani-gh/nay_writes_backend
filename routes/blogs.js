const express = require("express");
const router = express.Router();
const {
  uploadImageToCloudinary,
  cloudinaryDelete,
} = require("../utils/cloudinary");
const multerUpload = require("../utils/multer");
const Blog = require("../models/blogs");
const fs = require("fs");
const { authUser } = require("../middleware/auth");

/* =========================GET ALL PUBLIC BLOGS========================================================*/
router.get("/public", async (req, res) => {
  const blogs = await Blog.find();
  res.json(blogs);
});
/* =========================  END ========================================================*/

/* =========================GET ALL PRIVATE BLOGS========================================================*/
router.get("/private", authUser, async (req, res) => {
  const blogs = await Blog.find();
  const user = req.currentuser;
  res.json({ blogs: blogs, user: user });
});
/* =========================  END ========================================================*/

/* =========================GET A BLOG BY ID========================================================*/
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    return res.status(200).json(blog);
  } catch (error) {
    console.log("error getting blog by id", error);
  }
});
/* =========================  END ========================================================*/

/* =========================POST A BLOG ========================================================*/

router.post("/", multerUpload.single("image"), async (req, res) => {
  const { title, content, blogger, category, summary } = req.body;

  try {
    let imageUrl = null;
    let imageId = null;

    if (req.file) {
      const { path } = req.file;
      const { imageUrl: uploadedImageUrl, publicId: uploadedImageId } =
        await uploadImageToCloudinary(path);
      imageUrl = uploadedImageUrl;
      imageId = uploadedImageId;
    }

    const newBlogData = {
      title,
      summary,
      content,
      category,
      blogger,
    };

    if (imageUrl) {
      newBlogData.image = imageUrl;
      newBlogData.imageId = imageId;
    }

    const newBlog = await Blog.create(newBlogData);

    if (newBlog) {
      return res.status(200).json({ message: "Blog added successfully" });
    } else {
      return res.status(400).json({ message: "Blog could not be added" });
    }
  } catch (error) {
    console.log("Error Adding the blog", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ========================= END ========================================================*/

/* =========================UPDATE A BLOG========================================================*/

router.put("/:id", multerUpload.single("image"), async (req, res) => {
  const { id } = req.params;

  try {
    const { title, content, blogger, category, removeImage } = req.body;
    const blog = await Blog.findById(id);

    // Check if the removeImage flag is set to true
    if (removeImage === "true") {
      // If removeImage is true, delete the image from Cloudinary if it exists
      if (blog.imageId) {
        await cloudinaryDelete(blog.imageId);
        // Clear the image and imageId fields from the blog
        blog.image = undefined;
        blog.imageId = undefined;
      }
    } else if (req.file) {
      // If a new image was uploaded
      const { path } = req.file;

      // Delete the previous image from Cloudinary if it exists
      if (blog.imageId) {
        await cloudinaryDelete(blog.imageId);
      }

      // Upload the new image to Cloudinary
      const { imageUrl, publicId } = await uploadImageToCloudinary(path);

      // Update blog with new image data
      blog.image = imageUrl;
      blog.imageId = publicId;
    }

    // Update blog with other fields
    blog.title = title;
    blog.content = content;
    blog.blogger = blogger;
    blog.category = category;

    // Save the updated blog
    await blog.save();

    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error Updating Blog", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* ========================= END ========================================================*/

/* =========================DELETE A BLOG========================================================*/

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (blog.image) {
      await cloudinaryDelete(blog.imageId);
    }

    if (blog) {
      return res.status(200).json({ message: "Successfully deleted Blog" });
    } else {
      return res.status(401).json({ message: "could not find Blog" });
    }
  } catch (error) {
    console.log("Error Deleting Blog", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
/* ========================= END ========================================================*/

module.exports = router;
