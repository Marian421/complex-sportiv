const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Automatically reads from process.env.CLOUDINARY_URL
cloudinary.config();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "fields",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

module.exports = upload;
