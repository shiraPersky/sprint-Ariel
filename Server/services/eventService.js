import eventData from '../dataLayer/event.data.js';



export const getAllEventsWithParticipantsService = async () => {

  const events = await eventData.getAllWithParticipants();
  return events;
};