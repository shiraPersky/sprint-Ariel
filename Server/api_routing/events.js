

import express from 'express';
import { getAllEventsWithParticipantsService, getAvailableMembersForEventService, getParticipantsByEventIdService, addParticipantToEventService,getEventById } from '../services/eventService.js';
import { getMemberForUser } from "../services/memberService.js";
import {sendInviteWithResend, getMemberEmailById} from '../services/calendarService.js';

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

router.get('/:id_event/available-members', async (req, res, next) => {
    try {
        const id_event = parseInt(req.params.id_event);
        if (isNaN(id_event)) {
            return res.status(400).json({ success: false, error: 'Invalid event ID' });
        }

        const members = await getAvailableMembersForEventService(id_event);
        res.json({ success: true, data: members, count: members.length });
    } catch (error) {
        next(error);
    }
});

router.get('/:id_event/participants', async (req, res, next) => {
    try {
        const id_event = parseInt(req.params.id_event);
        if (isNaN(id_event)) {
            return res.status(400).json({ success: false, error: 'Invalid event ID' });
        }

        const participants = await getParticipantsByEventIdService(id_event);

        res.json({
            success: true,
            data: participants,
            count: participants.length
        });
    } catch (err) {
        next(err);
    }
});

router.post('/:id_event/participants', async (req, res, next) => {
    try {
        const id_event = parseInt(req.params.id_event);
        const { id_community_member } = req.body;

        if (isNaN(id_event) || isNaN(id_community_member)) {
            return res.status(400).json({ success: false, error: 'Invalid IDs' });
        }

        // 1. add participiant
        await addParticipantToEventService(id_event, id_community_member);

        // send the mail 
        (async () => {
            try {
                const participantEmail = await getMemberEmailById(id_community_member);
                const event = await getEventById(id_event);

                if (!participantEmail) {
                    console.warn(`Invite not was sent ${id_community_member} .`);
                    return;
                }

                console.log('📅 event.time:', event);
                console.log('📨 Sending invite to:', participantEmail);
                await sendInviteWithResend(participantEmail, {
                    title: event.description,
                    time: event.time,
                    //description: event.description,
                    location: event.location,
                });



                console.log(`invition was sent${participantEmail}  for event "${event.title}"`);

            } catch (err) {
                console.error(`send error ${id_community_member}:`, err);
            }
        })();

        // 3. תגובה ללקוח
        res.status(201).json({ success: true, message: 'Participant added' });

    } catch (err) {
        if (err.code === 'P2002') {
            res.status(409).json({ success: false, error: 'Participant already in event' });
        } else {
            next(err);
        }
    }
});


export default router;
