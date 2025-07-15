import express from 'express';
import * as communityMemberService from '../services/memberService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    console.log("get all");
    const members = await communityMemberService.getAllMembers();
    res.json(members); 
  } catch (err) {
    next(err); 
  }
});

export default router;
