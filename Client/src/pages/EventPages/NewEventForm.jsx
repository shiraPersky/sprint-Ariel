import { useState } from "react";

export default function NewEventForm({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        description: "",
        time: "",
        location: "",
        type: "",
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to create event");
            }

            onSuccess(); // רענון הרשימה
            onClose();   // סגירת הטופס
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-white border rounded-xl shadow p-6 max-w-xl mx-auto mb-6">
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">➕ Add New Event</h2>

            {error && (
                <div className="text-red-600 mb-3 text-sm border border-red-300 bg-red-50 p-2 rounded">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="description"
                    placeholder="Event Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                <input
                    type="datetime-local"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                <input
                    type="text"
                    name="type"
                    placeholder="Event Type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                />

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:underline"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
