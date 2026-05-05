"use client";

import { useState } from "react";
import Form from "@/components/Form";
import ResultCard from "@/components/ResultCard";

export default function Home() {
  const [result, setResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      
      <h1 className="text-3xl font-bold text-white mb-6">
        MCA College Predictor
      </h1>

      <Form setResult={setResult} />

      {/* 🔥 EXPECTED RANK AT TOP */}
      {result && (
        <div className="mt-6 bg-white px-6 py-3 rounded-lg shadow text-center">
          <p className="text-gray-700 text-sm">Expected Rank</p>
          <p className="text-2xl font-bold text-black">
            {result.expectedRank}
          </p>
        </div>
      )}

      {/* 🔥 RESULT CARDS BELOW */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full max-w-5xl">
          <ResultCard
            title="High Chance"
            data={result.high}
            color="bg-gray-100"
          />
          <ResultCard
            title="Medium Chance"
            data={result.medium}
            color="bg-gray-100"
          />
          <ResultCard
            title="Low Chance"
            data={result.low}
            color="bg-gray-100"
          />
        </div>
      )}
    </div>
  );
}