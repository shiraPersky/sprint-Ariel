import express from 'express';
import { getAllGroups } from '../services/group.service.js';

const router = express.Router();

// GET all groups with selected fields
router.get('/', async (req, res, next) => {
  try {
    // Get all groups from the service layer
    const groups = await getAllGroups();
    // console.log(`✅ Found ${groups} groups`);
    // // Map the relevant fields to return

    const groupsData = groups.map(group => ({
      id: group.id_group,
      name: group.group_name,
      // membersCount: group.members?.length || 0
    }));
    console.log(`✅ Found ${groupsData.id} groups`);
    // Send successful response
    res.json({
      success: true,
      data: groupsData,
      count: groupsData.length
    });
  } catch (error) {
    next(error); // Forward to error handling middleware
  }
});

export default router;