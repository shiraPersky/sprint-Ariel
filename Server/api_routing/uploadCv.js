import express from 'express';
import multer from 'multer';
import { extractTextFromPdfBuffer } from '../services/cvService.js'; 

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const buffer = req.file.buffer;
    const text = await extractTextFromPdfBuffer(buffer);

    res.json({ success: true, extractedText: text });
  } catch (error) {
    console.error('CV upload error:', error);
    console.error('CV upload error:', error); 

    res.status(500).json({ success: false, error: 'Failed to parse CV' });
  }
});

export default router;
