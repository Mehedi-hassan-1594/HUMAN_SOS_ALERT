const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth"); // auth.js route
const alertRoutes = require("./routes/alertRoutes"); // alert routes (message & priority support)
const db = require("./config/db");

const app = express();
const PORT = 8080;

// 🔧 Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔹 Serve frontend folder directly at /frontend
app.use('/frontend', express.static(path.join(__dirname, "..", "frontend")));

// ========================
// Routes
// ========================

// ✅ Auth Routes (login/register)
app.use("/api/auth", authRoutes);

// ✅ Alert Routes
app.use("/api/alerts", alertRoutes);

// ========================
// User routes
// ========================

// Get user profile by ID
app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result[0]);
  });
});

// Get all SOS alerts of a user
app.get("/api/users/:id/alerts", (req, res) => {
  const userId = req.params.id;
  db.query(
    "SELECT * FROM sos_alerts WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Add new SOS alert with message (user side)
app.post("/api/users/:id/alerts", (req, res) => {
  const userId = req.params.id;
  const { location, priority, message } = req.body;

  if (!location || !priority || !message) {
    return res.status(400).json({ error: "Location, priority, and message are required" });
  }

  db.query(
    "INSERT INTO sos_alerts (user_id, location, priority, message, created_at) VALUES (?, ?, ?, ?, NOW())",
    [userId, location, priority, message],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        success: true,
        id: result.insertId,
        user_id: userId,
        location,
        priority,
        message,
        created_at: new Date()
      });
    }
  );
});

// Get all police stations
app.get("/api/users/:id/stations", (req, res) => {
  db.query("SELECT * FROM police_stations", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ========================
// Admin routes
// ========================

// Get all users
app.get("/api/users", (req, res) => {
  db.query("SELECT id, username, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Serve admin panel HTML
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin.html"));
});

// Get all police stations
app.get("/api/stations", (req, res) => {
  db.query("SELECT * FROM police_stations", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Serve user dashboard HTML
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "user_dashboard.html"));
});

// ========================
// Start server
// ========================
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
