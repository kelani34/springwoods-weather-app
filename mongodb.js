const admin = require("firebase-admin");
const MongoClient = require("mongodb").MongoClient;

// Your Firebase Admin SDK configuration
const serviceAccount = require("./path/to/your/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-database-url.firebaseio.com",
});

const database = admin.database();

// Your MongoDB connection string
const mongoDBUrl = "mongodb://username:password@localhost:27017/your-db-name";

MongoClient.connect(mongoDBUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }

  console.log("Connected to MongoDB");
  const db = client.db("your-db-name");
  const eventsCollection = db.collection("events");

  // Listen for changes in your Firebase Realtime Database
  database.ref("events").on("child_added", (snapshot) => {
    const event = snapshot.val();

    // Store the event in MongoDB
    eventsCollection.insertOne(event, (err, result) => {
      if (err) {
        console.error("Error inserting event into MongoDB:", err);
      } else {
        console.log("Event inserted into MongoDB:", result.ops[0]);
      }
    });
  });
});
