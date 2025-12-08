const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
const fs = require('fs');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substring(2,8)}${ext}`;
    cb(null, name);
  }
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Nur PDF-Dateien erlaubt'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Single file upload: field name should be 'file'
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

module.exports = router;
