const express = require("express");
const router = express.Router();
const Category = require("../models/categories");

// ==========GET ALL CATEGORIES---------------------
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// ===============================POST A NEW CATEGORY==================

router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const catAvail = await Category.findOne({ category_name: name });

    if (catAvail) {
      return res.status(409).json({ message: "Category Already Exists" });
    }

    await Category.create({
      category_name: name,
    });

    return res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Error adding category:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//================= UPDATE A CATEGORY--------------------

router.put("/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    const existingCat = await Category.findByIdAndUpdate(id, {
      category_name: name,
    });

    if (!existingCat) {
      return res.status(404).json({ message: "Category does not exist" });
    }
    return res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.log("Error Updating Category", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category does not exist" });
    }

    return res.status(202).json({ message: "Category Deleted Successfully" });
  } catch (error) {
    console.log("Error Deleting Category", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
