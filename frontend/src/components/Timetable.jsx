import React, { useState } from "react";
import { API_BASE } from "../api";

const Timetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateTimetable = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // JWT token stored after login

      const res = await fetch(`${API_BASE}/timetable/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to generate timetable");
      }

      const data = await res.json();
      setTimetable(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Timetable Generator</h2>
      <button
        onClick={generateTimetable}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Timetable"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {timetable && (
        <div className="mt-4 overflow-auto">
          <table className="border-collapse border border-gray-400 w-full text-left">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">Day / Period</th>
                {Array(Object.values(timetable)[0].length)
                  .fill(0)
                  .map((_, idx) => (
                    <th key={idx} className="border border-gray-400 p-2">
                      Period {idx + 1}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(timetable).map(([day, periods]) => (
                <tr key={day}>
                  <td className="border border-gray-400 p-2">Day {+day + 1}</td>
                  {periods.map((slot, idx) => (
                    <td key={idx} className="border border-gray-400 p-2">
                      {slot
                        ? `${slot.subject} (${slot.teacher}) [${slot.room}]`
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Timetable;