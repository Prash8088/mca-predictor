import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { calculateExpectedRank } from "@/utils/rankCalculator";

// 🔥 GROUP + AVERAGE FUNCTION
function groupAndAverage(data: any[]) {
  const grouped: any = {};

  data.forEach((item) => {
    const key = item.collegeName.trim().toLowerCase();

    if (!grouped[key]) {
      grouped[key] = {
        collegeName: item.collegeName,
        totalOpening: 0,
        totalClosing: 0,
        count: 0,
      };
    }

    grouped[key].totalOpening += Number(item.safeRank);
    grouped[key].totalClosing += Number(item.avgClosingRank);
    grouped[key].count += 1;
  });

  return Object.values(grouped).map((college: any) => ({
    collegeName: college.collegeName,
    safeRank: Math.floor(college.totalOpening / college.count),
    avgClosingRank: Math.floor(college.totalClosing / college.count),
  }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { exam, marks, category, difficulty } = body;

    const expectedRank = calculateExpectedRank(
      exam,
      Number(marks),
      difficulty
    );

    let high: any[] = [];
    let medium: any[] = [];
    let low: any[] = [];

    const snapshot = await db
      .collection("college_cutoffs")
      .where("exam", "==", exam)
      .where("category", "==", category)
      .get();

    snapshot.docs.forEach((doc: any) => {
      const data = doc.data();

      const safeRank = Number(data.safeRank);
      const closingRank = Number(data.avgClosingRank);

      // 🔥 EXCLUDE SPECIFIC COLLEGE
      const excludeCollege =
        data.collegeName
          ?.toLowerCase()
          .includes("national institute of technology karnataka");

      if (!excludeCollege) {
        if (expectedRank <= safeRank) {
          high.push(data);
        } else if (expectedRank <= closingRank) {
          medium.push(data);
        } else {
          low.push(data);
        }
      }
    });

    // 🔥 APPLY AVERAGING
    const finalHigh = groupAndAverage(high);
    const finalMedium = groupAndAverage(medium);
    const finalLow = groupAndAverage(low);

    // 🔥 SORT AFTER AVERAGING
    finalHigh.sort((a, b) => a.safeRank - b.safeRank);
    finalMedium.sort((a, b) => a.safeRank - b.safeRank);
    finalLow.sort((a, b) => a.safeRank - b.safeRank);

    return NextResponse.json({
      expectedRank,
      high: finalHigh,
      medium: finalMedium,
      low: finalLow,
    });
  } catch (error) {
    console.error("ERROR =>", error);
    return NextResponse.json({
      error: "Something went wrong",
    });
  }
}