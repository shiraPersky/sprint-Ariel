import { createMemberWithLinkedIn } from "../services/uploadService.js";

import express from "express";
const router = express.Router();

// POST create with linkedin_url
router.post("/", async (req, res) => {
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
