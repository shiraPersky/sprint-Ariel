import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedEventId, setExpandedEventId] = useState(null);

    const navigate = useNavigate();

    const handleMemberClick = (memberId) => {
        navigate(`/member/${memberId}/data`);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/events/events-with-participants");
                if (!response.ok) throw new Error("Failed to fetch events");
                const data = await response.json();
                setEvents(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const toggleParticipants = (eventId) => {
        setExpandedEventId(expandedEventId === eventId ? null : eventId);
    };

    const formatDate = (datetime) =>
        new Date(datetime).toLocaleDateString("en-GB");
    const formatTime = (datetime) =>
        new Date(datetime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    if (loading) return <div className="p-4 text-center">Loading events...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
                    📅 Event Management
                </h1>
                <div className="space-y-4">
                    {events.map((event) => (
                        <div
                            key={event.id_event}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition text-sm"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                                    <div>
                                        <h2 className="font-semibold text-indigo-700 text-base">
                                            {event.description}
                                        </h2>
                                        <p className="text-gray-600">
                                            {formatDate(event.time)} at {formatTime(event.time)}
                                        </p>
                                    </div>
                                    <div className="text-gray-600">
                                        <div>
                                            <span className="font-medium">Location:</span> {event.location}
                                        </div>
                                        <div>
                                            <span className="font-medium">Type:</span> {event.type || "N/A"}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => toggleParticipants(event.id_event)}
                                        className="text-indigo-600 hover:underline font-medium"
                                    >
                                        {expandedEventId === event.id_event ? "Hide Participants" : "Show Participants"}
                                    </button>
                                </div>
                            </div>
                            {expandedEventId === event.id_event && (
                                <div className="mt-3 text-gray-700">
                                    <h3 className="font-semibold mb-1">👥 Participants:</h3>
                                    <ul className="list-disc list-inside">
                                        {event.participants?.length > 0 ? (
                                            event.participants.map((p) => (
                                                <li key={p.id_community_member}>
                                                    <button
                                                        onClick={() => handleMemberClick(p.id_community_member)}
                                                        className="text-indigo-600 hover:underline"
                                                    >
                                                        {p.english_name}
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No participants yet.</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
