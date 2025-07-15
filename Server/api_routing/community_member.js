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



    

// router.put('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const updateData = req.body;

//     const updatedUser = await updateMemberById(id, updateData);

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found or update failed' });
//     }

//     res.json(updatedUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
export default router;