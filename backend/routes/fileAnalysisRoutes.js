const express = require('express');
const multer = require('multer');
const { inspectFile } = require('../utils/fileAnalyzer');

const router = express.Router();

// Configurar multer para almacenar archivos en memoria (límite 25MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB
});

router.post('/api/analyze-file', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Please select a file to inspect.' });
  }

  try {
    const report = await inspectFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    return res.status(200).json({ report });
  } catch (error) {
    console.error('File analysis error:', error);
    return res.status(500).json({ error: 'An error occurred while inspecting the file.' });
  }
});

module.exports = router;