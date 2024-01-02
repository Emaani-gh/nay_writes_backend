const multer = require("multer");
const cloudinaryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ""),
});

const multerUpload = multer({ storage: cloudinaryStorage });

module.exports = multerUpload;
