"use client";

import { useState } from "react";

export default function Form({
  setResult,
}: any) {

  const [form, setForm] =
    useState({
      exam: "NIMCET",
      marks: "",
      category: "General",
      difficulty: "Moderate",
    });

  // 🔥 ERROR
  const [error, setError] =
    useState("");

  // 🔥 LOADING
  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async () => {

      // 🔥 CLEAR OLD ERROR
      setError("");

      let maxMarks = 0;

      // 🔥 EXAM LIMITS
      if (
        form.exam === "NIMCET"
      ) {

        maxMarks = 1000;

      } else if (
        form.exam ===
        "MAH-MCA-CET"
      ) {

        maxMarks = 200;

      } else if (
        form.exam === "CUET-PG"
      ) {

        maxMarks = 300;
      }

      const enteredMarks =
        Number(form.marks);

      // 🔥 VALIDATION
      if (

        enteredMarks < 0 ||

        enteredMarks > maxMarks ||

        form.marks === ""

      ) {

        setError(
          `Please enter marks between 0 and ${maxMarks} for ${form.exam}`
        );

        return;
      }

      try {

        // 🔥 START LOADING
        setLoading(true);

        const res = await fetch(
          "/api/predict",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              form
            ),
          }
        );

        const data =
          await res.json();

        setResult(data);

        // 🔥 STOP LOADING
        setLoading(false);

      } catch (err) {

        // 🔥 STOP LOADING
        setLoading(false);

        setError(
          "Failed to fetch prediction."
        );
      }
    };

  return (

    <div className="grid gap-4 p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto w-full">

      {/* 🔥 EXAM */}
      <select
        className="border p-3 rounded-lg text-black bg-white"
        value={form.exam}
        onChange={(e) =>
          setForm({
            ...form,
            exam: e.target.value,
          })
        }
      >

        <option>
          NIMCET
        </option>

        <option>
          CUET-PG
        </option>

        <option>
          MAH-MCA-CET
        </option>

      </select>

      {/* 🔥 MARKS */}
      <input
        type="number"
        placeholder="Enter Expected Marks"
        className="border p-3 rounded-lg text-black placeholder-gray-500 bg-white"
        value={form.marks}
        onChange={(e) =>
          setForm({
            ...form,
            marks: e.target.value,
          })
        }
      />

      {/* 🔥 ERROR */}
      {error && (

        <p className="text-red-500 text-sm font-medium">
          {error}
        </p>
      )}

      {/* 🔥 CATEGORY */}
      <select
        className="border p-3 rounded-lg text-black bg-white"
        value={form.category}
        onChange={(e) =>
          setForm({
            ...form,
            category:
              e.target.value,
          })
        }
      >

        <option>
          General
        </option>

        <option>
          OBC
        </option>

        <option>
          SC
        </option>

        <option>
          ST
        </option>

        <option>
          EWS
        </option>

      </select>

      {/* 🔥 DIFFICULTY */}
      <select
        className="border p-3 rounded-lg text-black bg-white"
        value={form.difficulty}
        onChange={(e) =>
          setForm({
            ...form,
            difficulty:
              e.target.value,
          })
        }
      >

        <option>
          Easy
        </option>

        <option>
          Moderate
        </option>

        <option>
          Hard
        </option>

      </select>

      {/* 🔥 BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`p-3 rounded-lg transition font-semibold text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >

        {loading
          ? "Predicting..."
          : "Predict Colleges"}

      </button>
    </div>
  );
}