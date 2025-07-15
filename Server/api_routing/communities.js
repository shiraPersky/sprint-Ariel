import express from "express";
import { getAllGroups } from "../services/groupService.js";
import {
  addMemberToGroup,
  removeMemberFromGroup,
} from "../services/groupMember.service.js";

const router = express.Router();

// GET all groups with selected fields
router.get("/", async (req, res, next) => {
  try {
    // Get all groups from the service layer
    const groups = await getAllGroups();

    // Map the relevant fields to return
    const groupsData = groups.map((group) => ({
      id: group.id,
      name: group.name,
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
//deletemember by id_group, id_community_member
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

export default router;
