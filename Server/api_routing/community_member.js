import express from 'express';
import { getMemberById} from '../services/memberService.js';

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



 router.put('/:id?', async (req, res, next) => {
  try {
    const id = req.params.id; // may be undefined
    const body = req.body;

    const result = await createOrUpdateMember(id, body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;