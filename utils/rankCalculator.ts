export function calculateExpectedRank(
  exam: string,
  marks: number,
  difficulty: string
) {

  let percentage = 0;
  let maxRank = 0;

  // NIMCET
  if (exam === "NIMCET") {

    percentage = (marks / 1000) * 100;
    maxRank = 1200;

  }

  // MAH-MCA-CET
  else if (exam === "MAH-MCA-CET") {

    percentage = (marks / 200) * 100;
    maxRank = 5000;

  }

  // CUET-PG
 else if (exam === "CUET-PG") {

  //CUET-PG TOTAL = 300
  percentage = (marks / 300) * 100;

  //CUET HAS LARGER RANK SPREAD
  maxRank = 4000;
}

  // PERCENTILE STYLE
  let baseRank = Math.floor(
    maxRank *
    Math.pow((100 - percentage) / 100, 2)
  );

  //DIFFICULTY
  if (difficulty === "Easy") {

    baseRank += Math.floor(maxRank * 0.05);

  } else if (difficulty === "Hard") {

    baseRank -= Math.floor(maxRank * 0.05);
  }

  // MIN LIMIT
  if (baseRank < 1) baseRank = 1;

  return baseRank;
}