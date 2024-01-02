const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

const uploadImageToCloudinary = async (image) => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "Blogs",
      allowed_formats: ["jpg", "png", "jpeg"],
    });
    return {
      imageUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};

// const updateImageToCloudinary = async (image, publicId) => {
//   try {
//     const updatedImage = await cloudinary.uploader.explicit(publicId, {
//       type: "upload",
//       overwrite: true,
//       resource_type: "image",
//       folder: "Blogs",
//       allowed_formats: ["jpg", "png", "jpeg"],
//       file: image,
//     });

//     return {
//       imageUrl: updatedImage.secure_url,
//       publicId: updatedImage.public_id,
//     };
//   } catch (error) {
//     console.error("Error updating image in Cloudinary:", error);
//     throw new Error("Image update failed");
//   }
// };

const cloudinaryDelete = async (public_id) => {
  const result = await cloudinary.uploader.destroy(public_id);
};

module.exports = {
  uploadImageToCloudinary,
  cloudinaryDelete,
};
