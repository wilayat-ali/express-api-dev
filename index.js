const express = require("express");
const app = express();

// Middleware to parse JSON
app.use(express.json());

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Hello, Express is running!");
});

// ✅ Test API
app.get("/api/test", (req, res) => {
  res.json({ message: "This is a test API" });
});

// ✅ Dynamic Route (User ID)
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User ID received: ${userId}` });
});

// ✅ POST API for Testing
app.post("/api/data", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required!" });
  }
  res.json({ message: "Data received", name, email });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
