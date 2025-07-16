import { useState } from "react";

export default function AddParticipant({ eventId, onSuccess }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchAvailableMembers = async () => {
    try {
      const res = await fetch(`http://localhost:5000/events/${eventId}/available-members`);
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error("Error fetching members:", err);
      return [];
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const all = await fetchAvailableMembers();
    const filtered = all.filter((m) =>
      m.english_name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleAdd = async (memberId) => {
    try {
      const res = await fetch(`http://localhost:5000/events/${eventId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_community_member: memberId }),
      });

      if (!res.ok) throw new Error("Failed to add participant");

      alert("✅ Participant added!");
      setSearchTerm('');
      setSuggestions([]);
      if (onSuccess) onSuccess(); // כדי לעדכן את האירוע אחרי הוספה
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="mt-2">
      <input
        type="text"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border px-2 py-1 rounded w-full text-sm"
      />
      <ul className="border rounded mt-1 bg-white max-h-40 overflow-auto text-sm">
        {suggestions.map((member) => (
          <li
            key={member.id_community_member}
            onClick={() => handleAdd(member.id_community_member)}
            className="px-3 py-1 hover:bg-indigo-100 cursor-pointer"
          >
            {member.english_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
