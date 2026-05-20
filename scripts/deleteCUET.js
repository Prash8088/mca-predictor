const admin = require("firebase-admin");

const serviceAccount = require(
  "../lib/serviceAccountKey.json"
);

admin.initializeApp({
  credential: admin.credential.cert(
    serviceAccount
  ),
});

const db = admin.firestore();

async function deleteCUETDocs() {

  try {

    //GET ONLY CUET-PG DOCS
    const snapshot = await db
      .collection("college_cutoffs")
      .where("exam", "==", "CUET-PG")
      .get();

    console.log(
      "TOTAL CUET DOCS:",
      snapshot.size
    );

    // DELETE IN BATCH
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log(
      "ALL CUET-PG DATA DELETED"
    );

  } catch (error) {

    console.error(
      "ERROR:",
      error
    );
  }
}

deleteCUETDocs();