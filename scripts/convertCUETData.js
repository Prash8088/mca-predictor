const fs = require("fs");

console.log("🚀 SCRIPT STARTED");

// 🔥 READ FILE
const rawData = fs.readFileSync(
  "./data/cuet_data.json",
  "utf-8"
);

const data = JSON.parse(rawData);

console.log(
  "TOTAL RECORDS:",
  data.length
);

// 🔥 CLEANER
function extractNumber(value) {

  if (!value) return 0;

  value = value.toString().trim();

  // 🔥 HANDLE 275/400
  if (value.includes("/")) {

    const parts = value.split("/");

    const obtained = Number(parts[0]);
    const total = Number(parts[1]);

    // 🔥 CONVERT TO 300 SCALE
    return Math.floor(
      (obtained / total) * 300
    );
  }

  // 🔥 HANDLE %
  if (value.includes("%")) {

    const percent = parseFloat(
      value.replace("%", "")
    );

    return Math.floor(
      (percent / 100) * 300
    );
  }

  // 🔥 HANDLE "Rank 45"
  if (
    value.toLowerCase().includes("rank")
  ) {

    return Number(
      value.replace(/[^0-9]/g, "")
    );
  }

  // 🔥 NORMAL NUMBER
  return Number(value);
}

// 🔥 SCORE → RANK
function scoreToRank(score) {

  // 🔥 HIGHER SCORE = BETTER RANK
  const rank = Math.floor(
    ((300 - score) / 300) * 4000
  );

  // 🔥 MINIMUM RANK
  return rank < 1 ? 1 : rank;
}

// 🔥 CONVERT
const converted = data.map(
  (item, index) => {

    // 🔥 EXTRACT SCORES
    const openingScore =
      extractNumber(
        item.openingRankScore
      );

    const closingScore =
      extractNumber(
        item.closingRankScore
      );

    // 🔥 CONVERT TO RANKS
    const openingRank =
      scoreToRank(openingScore);

    const closingRank =
      scoreToRank(closingScore);

    return {

      collegeId:
        item.institute
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(
            /[^a-z0-9_]/g,
            ""
          ) +
        "_" +
        index,

      collegeName:
        item.institute,

      exam: "CUET-PG",

      category:
        item.category ||
        "General",

      // 🔥 NOW RANK BASED
      safeRank: openingRank,

      avgClosingRank:
        closingRank,
    };
  }
);

// 🔥 SAVE FILE
fs.writeFileSync(
  "./data/cuet_converted.json",
  JSON.stringify(
    converted,
    null,
    2
  )
);

console.log(
  "✅ CUET DATA CONVERTED"
);