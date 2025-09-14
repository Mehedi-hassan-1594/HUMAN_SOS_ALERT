const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Register user
router.post('/register', (req, res) => {
  const { username, email, password, phone } = req.body;
  const sql = "INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, email, password, phone], (err, result) => {
    if(err) return res.status(500).send(err);
    res.send({ message: "✅ User registered successfully!", id: result.insertId });
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if(err) return res.status(500).send(err);
    if(result.length > 0) res.send(result[0]);
    else res.status(401).send({ error: "❌ Invalid credentials" });
  });
});

// Get user profile
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM users WHERE id=?";
  db.query(sql, [id], (err, result) => {
    if(err) return res.status(500).send(err);
    if(result.length > 0) res.send(result[0]);
    else res.status(404).send({ error: "User not found" });
  });
});

// Fetch user's SOS alerts
router.get('/:id/alerts', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM sos_alerts WHERE user_id=? ORDER BY created_at DESC";
  db.query(sql, [id], (err, result) => {
    if(err) return res.status(500).send(err);
    res.send(result);
  });
});

// Send new SOS alert
router.post('/:id/alerts', (req, res) => {
  const { id } = req.params;
  const { location, priority } = req.body;
  const sql = "INSERT INTO sos_alerts (user_id, location, priority, created_at) VALUES (?, ?, ?, NOW())";
  db.query(sql, [id, location, priority], (err, result) => {
    if(err) return res.status(500).send(err);
    res.send({ message: "✅ SOS Alert sent!", id: result.insertId });
  });
});

// Fetch police stations
router.get('/:id/stations', (req, res) => {
  const sql = "SELECT * FROM police_stations";
  db.query(sql, (err, result) => {
    if(err) return res.status(500).send(err);
    res.send(result);
  });
});

module.exports = router;
