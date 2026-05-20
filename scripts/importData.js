const admin = require("firebase-admin");

const serviceAccount = require(
  "../lib/serviceAccountKey.json"
);

// 🔥 LOAD JSON
const data = require(
  "../data/cuet_converted.json"
);

admin.initializeApp({
  credential: admin.credential.cert(
    serviceAccount
  ),
});

const db = admin.firestore();

async function importData() {

  let success = 0;
  let failed = 0;

  for (const college of data) {

    try {

      // 🔥 UNIQUE DOCUMENT ID
      const uniqueId =

        `${college.collegeId}_` +

        `${college.category}_` +

        `${college.safeRank}_` +

        `${college.avgClosingRank}`;

      await db
        .collection("college_cutoffs")
        .doc(uniqueId)
        .set(college);

      console.log(
        "✅ Added:",
        college.collegeName
      );

      success++;

    } catch (err) {

      console.log(
        "❌ Error:",
        college.collegeName
      );

      failed++;
    }
  }

  console.log(
    "\n🎯 IMPORT FINISHED"
  );

  console.log(
    "✅ Success:",
    success
  );

  console.log(
    "❌ Failed:",
    failed
  );
}

importData();