// const multer = require("multer");
// // require("../")

// // Configure storage options for multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../uploads"); // Set the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// // Initialize multer with the storage options
// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require("multer");
const path = require("path");

// Configure storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Initialize multer with the storage options
const upload = multer({ storage: storage });

module.exports = upload;
