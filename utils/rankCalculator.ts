export function calculateExpectedRank(
  exam: string,
  marks: number,
  difficulty: string
) {
  let baseRank = 0;

  if (exam === "NIMCET") {
    baseRank = Math.floor(1200 - marks * 2);
  }

  if (exam === "CUET-PG") {
    baseRank = Math.floor(2000 - marks * 3);
  }

  if (exam === "MAH-MCA-CET") {
    baseRank = Math.floor(1500 - marks * 2.5);
  }

  let multiplier = 1;

  if (difficulty === "Easy") multiplier = 0.9;
  if (difficulty === "Moderate") multiplier = 1;
  if (difficulty === "Hard") multiplier = 1.1;

  return Math.max(1, Math.floor(baseRank * multiplier));
}