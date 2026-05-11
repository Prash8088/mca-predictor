const admin = require("firebase-admin");
const serviceAccount = require("../lib/serviceAccountKey.json");
const fs = require("fs");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportData() {
  try {
    console.log("Starting export...");

    const snapshot = await db.collection("college_cutoffs").get();

    console.log("Documents found:", snapshot.size);

    if (snapshot.empty) {
      console.log("No data found in Firestore");
      return;
    }

    const data = [];

    snapshot.forEach((doc) => {
      data.push(doc.data());
    });

    fs.writeFileSync(
      "./data/colleges_recovered.json",
      JSON.stringify(data, null, 2)
    );

    console.log("Data recovered:", data.length);
  } catch (error) {
    console.error("ERROR:", error);
  }
}

exportData();