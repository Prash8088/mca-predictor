"use client";

import { useState } from "react";

export default function Form({ setResult }: any) {
  // 🔥 THIS WAS MISSING
  const [form, setForm] = useState({
    exam: "NIMCET",
    marks: "",
    category: "General",
    difficulty: "Moderate",
  });

  const handleSubmit = async () => {
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="grid gap-4 p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">

      {/* Exam */}
      <select
        className="border p-3 rounded text-black bg-white"
        value={form.exam}
        onChange={(e) =>
          setForm({ ...form, exam: e.target.value })
        }
      >
        <option>NIMCET</option>
        <option>CUET-PG</option>
        <option>MAH-MCA-CET</option>
      </select>

      {/* Marks */}
      <input
        type="number"
        placeholder="Enter Expected Marks"
        className="border p-3 rounded text-black placeholder-gray-500 bg-white"
        value={form.marks}
        onChange={(e) =>
          setForm({ ...form, marks: e.target.value })
        }
      />

      {/* Category */}
      <select
        className="border p-3 rounded text-black bg-white"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option>General</option>
        <option>OBC</option>
        <option>SC</option>
        <option>ST</option>
        <option>EWS</option>
      </select>

      {/* Difficulty */}
      <select
        className="border p-3 rounded text-black bg-white"
        value={form.difficulty}
        onChange={(e) =>
          setForm({ ...form, difficulty: e.target.value })
        }
      >
        <option>Easy</option>
        <option>Moderate</option>
        <option>Hard</option>
      </select>

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
      >
        Predict Colleges
      </button>
    </div>
  );
}