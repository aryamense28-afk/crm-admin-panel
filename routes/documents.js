const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload file
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ message: "File uploaded", file: req.file });
});

// List files (for simplicity, return static files)
router.get("/", (req, res) => {
  // You can later read from MongoDB
  res.json([]);
});

module.exports = router;