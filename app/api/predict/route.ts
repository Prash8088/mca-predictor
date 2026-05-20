import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { calculateExpectedRank } from "@/utils/rankCalculator";

// GROUP + AVERAGE SAME COLLEGES
function groupAndAverage(data: any[]) {

  const grouped: any = {};

  data.forEach((item) => {

    const key = item.collegeName
      ?.trim()
      ?.toLowerCase();

    // SKIP BAD DATA
    if (!key) return;

    if (!grouped[key]) {

      grouped[key] = {
        collegeName:
          item.collegeName ||
          "Unknown College",

        totalOpening: 0,
        totalClosing: 0,
        count: 0,
      };
    }

    grouped[key].totalOpening +=
      Number(item.safeRank || 0);

    grouped[key].totalClosing +=
      Number(item.avgClosingRank || 0);

    grouped[key].count += 1;
  });

  return Object.values(grouped).map(
    (college: any) => ({

      collegeName:
        college.collegeName,

      safeRank: Math.floor(
        college.totalOpening /
        college.count
      ),

      avgClosingRank: Math.floor(
        college.totalClosing /
        college.count
      ),
    })
  );
}

// ADD MATCH SCORE
function addScore(
  data: any[],
  expectedRank: number
) {

  return data.map((college) => {

    const closingRank = Number(
      college.avgClosingRank || 1
    );

    const diff = Math.abs(
      closingRank - expectedRank
    );

    const score = Math.max(
      0,
      100 -
      (diff / closingRank) * 100
    );

    return {
      ...college,
      score: Math.floor(score),
    };
  });
}

export async function POST(req: Request) {

  console.log("API STARTED");

  try {

    const body = await req.json();

    console.log("BODY:", body);

    const {
      exam,
      marks,
      category,
      difficulty,
    } = body;

    // CALCULATE EXPECTED RANK
    const expectedRank =
      calculateExpectedRank(
        exam,
        Number(marks),
        difficulty
      );

    console.log(
      "EXPECTED RANK:",
      expectedRank
    );

    let high: any[] = [];
    let medium: any[] = [];
    let low: any[] = [];

    console.log(
      "BEFORE FIREBASE"
    );

    //FIREBASE QUERY
    const snapshot = await db
      .collection("college_cutoffs")
      .where("exam", "==", exam)
      .where("category", "==", category)
      .get();

    console.log(
      "FIREBASE SUCCESS"
    );

    console.log(
      "DOC COUNT:",
      snapshot.size
    );

    snapshot.docs.forEach((doc: any) => {

      const data = doc.data();

      const closingRank = Number(
        data.avgClosingRank || 0
      );

      //EXCLUDE COLLEGE
      const excludeCollege =
        data.collegeName
          ?.toLowerCase()
          ?.includes(
            "national institute of technology karnataka"
          );

      if (!excludeCollege) {

        // DEFAULT RANGES
        let highRange = 300;
        let mediumRange = 100;

        //NIMCET
        if (exam === "NIMCET") {

          highRange = 300;
          mediumRange = 100;
        }

        // MAH-MCA-CET
        else if (
          exam === "MAH-MCA-CET"
        ) {

          highRange = 500;
          mediumRange = 200;
        }

        // CUET-PG
        else if (
          exam === "CUET-PG"
        ) {

          highRange = 6000;
          mediumRange = 2500;
        }

        // SAME LOGIC FOR ALL EXAMS
        const difference =
          closingRank -
          expectedRank;

        // HIGH CHANCE
        if (
          difference >= highRange
        ) {

          high.push(data);

        // MEDIUM CHANCE
        } else if (
          difference >= mediumRange
        ) {

          medium.push(data);

        
        //LOW CHANCE
} else if (

  (
    exam === "MAH-MCA-CET" &&
    difference >= -1500
  )

  ||

  (
    exam === "CUET-PG" &&
    difference >= -4000
  )

  ||

  (
    exam === "NIMCET" &&
    difference >= 0
  )

) {

  low.push(data);
}
      }
    });

    console.log(
      "FILTERING DONE"
    );

    //GROUP + AVERAGE
    const finalHigh =
      groupAndAverage(high);

    const finalMedium =
      groupAndAverage(medium);

    const finalLow =
      groupAndAverage(low);

    console.log(
      "GROUPING DONE"
    );

    // ADD SCORE
    const scoredHigh =
      addScore(
        finalHigh,
        expectedRank
      );

    const scoredMedium =
      addScore(
        finalMedium,
        expectedRank
      );

    const scoredLow =
      addScore(
        finalLow,
        expectedRank
      );

    //BEST MATCH
    scoredHigh.sort(
      (a, b) =>
        b.score - a.score
    );

    scoredMedium.sort(
      (a, b) =>
        b.score - a.score
    );

    scoredLow.sort(
      (a, b) =>
        b.score - a.score
    );

    //BEST MATCH
    const bestCollege =
      [
        ...scoredHigh,
        ...scoredMedium,
      ].sort(
        (a, b) =>
          b.score - a.score
      )[0] || null;

    //EMPTY MESSAGES
    let highMessage = "";
    let mediumMessage = "";
    let lowMessage = "";

    if (scoredHigh.length === 0) {

      highMessage =
        "No colleges matched because your predicted rank is lower than high chance cutoff range.";
    }

    if (scoredMedium.length === 0) {

      mediumMessage =
        "No colleges matched because your predicted rank did not fall inside medium chance range.";
    }

    if (scoredLow.length === 0) {

      lowMessage =
        "No colleges matched because available college cutoffs are much lower than your predicted rank.";
    }

    console.log(
      "RESPONSE READY"
    );

    return NextResponse.json({

      expectedRank,

      bestCollege,

      high: scoredHigh,
      medium: scoredMedium,
      low: scoredLow,

      highMessage,
      mediumMessage,
      lowMessage,
    });

  } catch (error) {

    console.error(
      "ERROR =>",
      error
    );

    return NextResponse.json({
      error:
        "Something went wrong",
    });
  }
}