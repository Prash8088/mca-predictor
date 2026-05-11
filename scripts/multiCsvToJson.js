const fs = require("fs");
const csv = require("csv-parser");

const results = [];

fs.createReadStream("./data/csvs/MAH-MCA-CET.csv")
  .pipe(csv())
  .on("data", (row) => {
    try {
      // flexible column handling
      const collegeName =
        row["Institute"] ||
        row["College Name"] ||
        row["Institute Name"];

      if (!collegeName) return;

      const cleanName = collegeName.replace(/\n/g, " ").trim();

      // MAH usually has only closing rank
      let closingRank = Number(
        row["Closing Rank"] ||
        row["Rank"] ||
        row["Cutoff"]
      );

      if (isNaN(closingRank)) return;

      // create approximate opening rank
      let openingRank = closingRank - 50; // adjust if needed

      const json = {
        collegeId: cleanName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_"),

        collegeName: cleanName,
        exam: "MAH-MCA-CET",

        category:
          row["Category"] ||
          row["Quota"] ||
          "General",

        safeRank: openingRank,
        avgClosingRank: closingRank,
      };

      results.push(json);
    } catch (err) {
      console.log("Error row:", row);
    }
  })
  .on("end", () => {
    fs.writeFileSync(
      "./data/mah_colleges.json",
      JSON.stringify(results, null, 2)
    );

    console.log("Converted:", results.length);
  });