"use client";

import { useState } from "react";
import Form from "@/components/Form";
import ResultCard from "@/components/ResultCard";

export default function Home() {

  const [result, setResult] =
    useState<any>(null);

  return (

    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">

      {/*TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
        MCA College Predictor
      </h1>

      {/* FORM */}
      <Form setResult={setResult} />

      {/* EXPECTED RANK */}
      {result && (

        <div className="mt-6 bg-white px-6 py-4 rounded-2xl shadow-lg text-center w-full max-w-md">

          <p className="text-gray-500 text-sm">
            Expected Rank
          </p>

          <p className="text-3xl font-bold text-black mt-1">
            {result.expectedRank}
          </p>

        </div>
      )}

      {/* BEST COLLEGE */}
      {result?.bestCollege && (

        <div className="mt-6 bg-green-500 text-white p-5 rounded-2xl shadow-xl text-center w-full max-w-md">

          <h2 className="text-lg font-bold mb-2">
            Best Match
          </h2>

          <p className="text-xl font-semibold">
            {result.bestCollege.collegeName}
          </p>

          <p className="text-sm mt-2">
            Opening Rank:{" "}
            {result.bestCollege.safeRank}
          </p>

          <p className="text-sm">
            Closing Rank:{" "}
            {result.bestCollege.avgClosingRank}
          </p>

        </div>
      )}

      {/* RESULT CARDS */}
      {result && (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-6xl">

          {/* HIGH */}
          <ResultCard
            title="High Chance"
            data={result.high}
            message={result.highMessage}
            color="bg-green-100"
          />

          {/* MEDIUM */}
          <ResultCard
            title="Medium Chance"
            data={result.medium}
            message={result.mediumMessage}
            color="bg-yellow-100"
          />

          {/* LOW */}
          <ResultCard
            title="Low Chance"
            data={result.low}
            message={result.lowMessage}
            color="bg-red-100"
          />

        </div>
      )}
    </div>
  );
}