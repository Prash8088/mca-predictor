const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function cleanData() {
  const snapshot = await db.collection("college_cutoffs").get();

  console.log("Total docs:", snapshot.size);

  for (const doc of snapshot.docs) {
    const data = doc.data();

    //NEW CLEAN OBJECT
    const cleaned = {
      collegeId:
        data.collegeId ||
        data.collegeName.toLowerCase().replace(/[^a-z0-9]/g, "_"),

      collegeName: data.collegeName,
      exam: data.exam || "NIMCET",
      category: data.category || "General",

      safeRank: Number(data.safeRank),
      avgClosingRank: Number(data.avgClosingRank),
    };

    //overwrite document
    await db.collection("college_cutoffs").doc(doc.id).set(cleaned);
  }

  console.log("All documents cleaned!");
}

cleanData();