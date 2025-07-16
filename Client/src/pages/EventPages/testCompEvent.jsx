import { useState } from "react";

const useEventsAPI = () => {
  const [loading, setLoading] = useState(false);

  // פונקציה לקבלת כל האירועים מהשרת
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events"); // שנה ל-URL אמיתי של השרת שלך
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching events:", error);
      alert("שגיאה בטעינת האירועים");
      return [];
    }
  };

  // פונקציה לקבלת משתתפים לפי מזהה אירוע
  const fetchParticipants = async (eventId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}/participants`);
      if (!response.ok) {
        throw new Error("Failed to fetch participants");
      }
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching participants:", error);
      alert("שגיאה בטעינת המשתתפים");
      return [];
    }
  };

  return {
    loading,
    fetchEvents,
    fetchParticipants,
  };
};

export default useEventsAPI;
