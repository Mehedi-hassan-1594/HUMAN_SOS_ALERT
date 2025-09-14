const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ========================
// GET all SOS alerts (for admin)
// ========================
router.get("/", (req, res) => {
  const sql = `
    SELECT a.id, a.user_id, u.username, a.location, a.priority, a.message, a.created_at
    FROM sos_alerts a
    JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ========================
// POST new SOS alert (from user)
// ========================
router.post("/", (req, res) => {
  const { user_id, location, priority, message } = req.body;

  // Required fields validation
  if (!user_id || !location || !priority || !message) {
    return res.status(400).json({ error: "user_id, location, priority, and message are required" });
  }

  const sql = `
    INSERT INTO sos_alerts (user_id, location, priority, message, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [user_id, location, priority, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      success: true,
      message: "✅ SOS Alert sent!",
      id: result.insertId,
      user_id,
      location,
      priority,
      message,
      created_at: new Date()
    });
  });
});

module.exports = router;
