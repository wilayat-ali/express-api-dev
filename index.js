const express = require("express");
// const { db } = require("./firebase"); // Import Firestore
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // 🔥 Replace with your actual service key file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Firestore instance

const app = express();
app.use(express.json());

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Hello, Express is running!");
});

// Fetch all users and log them in the terminal
app.get("/api/users", async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log("No users found in Firestore.");
      return res.status(404).json({ message: "No users found" });
    }

    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched Users:", users); // ✅ Log data in the terminal

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// ✅ Fetch Single User by ID
app.get("/api/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection("users").doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

// ✅ Add New User to Firestore
app.post("/api/user", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required!" });
    }

    const newUser = await db.collection("users").add({ name, email });
    res.json({ message: "User added", id: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
