import eventData from '../dataLayer/event.data.js';

import participantEventData from '../dataLayer/participantEvent.data.js';


export const getParticipantsByEventIdService = async (id_event) => {
    return await participantEventData.getParticipantsByEventId(id_event);
};


export const getAvailableMembersForEventService = async (id_event) => {
    return await eventData.getAvailableMembersForEvent(id_event);
};

export const getAllEventsWithParticipantsService = async () => {

    const events = await eventData.getAllWithParticipants();
    return events;
};

export const addParticipantToEventService = async (id_event, id_community_member) => {
    return await participantEventData.create({
        id_event,
        id_community_member,
    });
};

export async function getEventById(id_event) {
    if (!id_event || isNaN(id_event)) {
        throw new Error('Invalid event ID');
    }

    const event = await eventData.getById(id_event);

    if (!event) {
        throw new Error(`Event with id ${id_event} not found`);
    }

    return event;
}

// export async function addParticipantToEventService(eventId, memberId) {
//   const existing = await participantEventData.getByIds(memberId, eventId);
//   if (existing) throw new Error('Participant already registered');

//   await participantEventData.create({ id_community_member: memberId, id_event: eventId });

//   const event = await eventData.getById(eventId);
//   const member = await communityMemberData.getById(memberId);

//   if (member.email) {
//     await sendICSInvite(member, event);
//   }

//   return { success: true };
// }