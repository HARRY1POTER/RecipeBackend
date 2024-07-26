const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "uploads/");
    // cb(null, "/tmp");
    cb(null, "/upload");

    

  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;


/* 
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // Set the destination directory to './uploads'
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for storing
  },
  
});

const upload = multer({ storage: storage });

module.exports = upload;
 */