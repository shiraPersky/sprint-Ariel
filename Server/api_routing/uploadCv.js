import express from 'express';
import multer from 'multer';
import { createMemberFromCvBuffer } from '../services/cvService/createCommunityMemberFromCv.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    
    const result = await createMemberFromCvBuffer(req.file.buffer);

    res.json({ success: true, id_community_member: result.createdMember.id_community_member });


  } catch (error) {
    console.error('CV upload error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to process CV' });
  }
});

export default router;
