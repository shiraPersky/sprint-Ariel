import express from 'express';
import { getMemberById, createMemberWithLinkedIn, createOrUpdateMember } from "../services/memberService.js";



const router = express.Router();

//Retrieve a single community member by their id.
router.get('/:id', async (req, res) => {
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

// PUT /member/:id -> update
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await createOrUpdateMember(id, data);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// PUT /member -> create
router.put('/', async (req, res, next) => {
  try {
    const data = req.body;
    const result = await createOrUpdateMember(null, data);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST create with linkedin_url
router.post("/linkedin", async (req, res) => {
  try {
    const { linkedin_url } = req.body;
    console.log('BODY:', req.body);
    if (!linkedin_url || typeof linkedin_url !== 'string' || !linkedin_url.startsWith('http')) {
  throw new Error('Invalid LinkedIn URL');
}
    const newMember = await getLinkedInProfileData(linkedin_url);
    res
      .status(201)
      .json({ id_community_member: newMember.id_community_member });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});



export default router;