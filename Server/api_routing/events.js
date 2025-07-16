

import express from 'express';
import { getAllEventsWithParticipantsService } from '../services/eventService.js';

const router = express.Router();

// GET all events with participants
router.get('/events-with-participants', async (req, res, next) => {
  try {
    const events = await getAllEventsWithParticipantsService();

    res.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;
