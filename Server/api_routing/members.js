import express from 'express';
import * as communityMemberService from '../services/memberService.js';
import { getCommonMembersInGroups } from '../services/groupService.js';

const router = express.Router();

//Return all members included data 
router.get('/', async (req, res, next) => {
  try {
    console.log("get all");
    const members = await communityMemberService.getAllMembers();
    res.json(members); 
  } catch (err) {
    next(err); 
  }
});

//Search people by some groups
router.post('/search/groups', async (req, res, next) => {
  try {
    const { groupIds } = req.body;

    if (!Array.isArray(groupIds) || groupIds.length < 2) {
      return res.status(400).json({ success: false, error: 'Please provide at least two group IDs' });
    }

    const commonMembers = await getCommonMembersInGroups(groupIds);

    res.json({
      success: true,
      data: commonMembers,
      count: commonMembers.length
    });
  } catch (error) {
    next(error);
  }
});
export default router;