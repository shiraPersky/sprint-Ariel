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