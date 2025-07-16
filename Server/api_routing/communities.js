import express from "express";
import { getAllGroups } from "../services/groupService.js";
import {
  addMemberToGroup,
  addMultipleMembersToGroup,
  removeMemberFromGroup,
  removeMultipleMembersFromGroup,
} from "../services/groupMember.service.js";

import { getMembersNotInGroup } from '../services/groupMember.service.js';
import { getMembersByGroupId } from '../services/groupService.js';



const router = express.Router();

// GET all members NOT in a specific group
router.get('/group/:id/members-not-in', async (req, res, next) => {
  try {
    const id_group = parseInt(req.params.id);

    if (isNaN(id_group)) {
      return res.status(400).json({ success: false, error: 'Invalid group ID' });
    }

    const members = await getMembersNotInGroup(id_group);

    res.json({
      success: true,
      data: members,
      count: members.length
    });
  } catch (error) {
    next(error);
  }
});

// GET all groups (return only id_group, group_name , membersCount)
router.get("/", async (req, res, next) => {
  try {
    // Get all groups from the service layer
    const groups = await getAllGroups();

    // Map the relevant fields to return
    const groupsData = groups.map((group) => ({
      id_group: group.id_group,
      group_name: group.group_name,
      membersCount: group.members?.length || 0,
    }));

    // Send successful response
    res.json({
      success: true,
      data: groupsData,
      count: groupsData.length,
    });
  } catch (error) {
    next(error); // Forward to error handling middleware
  }
});

// GET members by group ID
router.get("/group/:id/members", async (req, res, next) => {
  try {
    const id_group = parseInt(req.params.id);
    if (isNaN(id_group)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid group ID" });
    }

    const members = await getMembersByGroupId(id_group);

    res.json({
      success: true,
      data: members,
      count: members.length,
    });
  } catch (error) {
    next(error);
  }
});

// Add member to groups
router.post("/add-member", async (req, res, next) => {
  try {
    const { id_group, id_community_member } = req.body;

    if (!id_group || !id_community_member) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Both group ID and member ID are required",
        });
    }

    const newEntry = await addMemberToGroup(id_group, id_community_member);

    res.status(201).json({
      success: true,
      data: newEntry,
    });
  } catch (error) {
    next(error);
  }
});

// Add multiple members to group
router.post("/add-members", async (req, res, next) => {
  try {
    const { id_group, id_community_members } = req.body;

    if (!id_group || !Array.isArray(id_community_members) || id_community_members.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Group ID and non-empty array of member IDs are required",
      });
    }

    const results = await addMultipleMembersToGroup(id_group, id_community_members);

    res.status(201).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
});


//Delete member by id_group, id_community_member
router.delete("/remove-member", async (req, res, next) => {
  try {
    const id_group = parseInt(req.query.id_group);
    const id_community_member = parseInt(req.query.id_community_member);

    if (isNaN(id_group) || isNaN(id_community_member)) {
      return res.status(400).json({
    success: false,
    error: "Both group ID and member ID must be valid numbers",
  });
}

    const result = await removeMemberFromGroup(id_group, id_community_member);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, error: "Member not found in group" });
    }

    res.json({
      success: true,
      message: "Member removed from group successfully",
    });
  } catch (error) {
    next(error);
  }
});


// Delete multiple members from a group
router.delete("/remove-members", async (req, res, next) => {
  try {
    const { id_group, id_community_members } = req.body;

    if (
      isNaN(parseInt(id_group)) ||
      !Array.isArray(id_community_members) ||
      id_community_members.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Group ID must be valid and a non-empty array of member IDs is required",
      });
    }

    const result = await removeMultipleMembersFromGroup(
      parseInt(id_group),
      id_community_members.map(Number)
    );

    res.json({
      success: true,
      message: "Members removed from group successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
