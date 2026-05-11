const admin = require("firebase-admin");

const serviceAccount = require(
  "../lib/serviceAccountKey.json"
);

// 🔥 LOAD NEW JSON
const data = require(
  "../data/mah_colleges.json"
);

admin.initializeApp({
  credential: admin.credential.cert(
    serviceAccount
  ),
});

const db = admin.firestore();

async function importData() {

  for (const college of data) {

    try {

      await db
        .collection("college_cutoffs")
        .doc(college.collegeId)
        .set(college);

      console.log(
        "Added/Updated:",
        college.collegeName
      );

    } catch (err) {

      console.log(
        "Error:",
        college.collegeName
      );
    }
  }

  console.log(
    "✅ All data imported successfully!"
  );
}

importData();