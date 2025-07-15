import express from 'express';
import { getMemberById, createOrUpdateMember, createMemberWithLinkedIn } from '../services/memberService.js';


const router = express.Router();


router.get('/:id', async (req, res,next) => {
    try {
        const id = req.params.id;
        const user = await getMemberById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        next(err); 
    }
});


router.put('/', async (req, res, next) => {
  try {
    const id = req.query.id || null;
    const data = req.body;
    const result = await createOrUpdateMember(id, data);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST create with linkedin_url
router.post("/linkedin", async (req, res) => {
  try {
    const { linkedin_url } = req.body;
    const newMember = await createMemberWithLinkedIn(linkedin_url);
    res
      .status(201)
      .json({ id_community_member: newMember.id_community_member });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

export default router;