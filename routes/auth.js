const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// ✅ User Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password, phone, location, emergencyContact, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const checkSql = 'SELECT id FROM users WHERE username = ?';
    db.query(checkSql, [username], async (checkErr, existing) => {
      if (checkErr) return res.status(500).json({ error: checkErr.message });
      if (existing.length > 0) return res.status(409).json({ error: 'Username already exists' });

      const hashed = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO users 
        (username, email, password, phone, role, location, emergency_contact, last_login) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      db.query(insertSql, [
        username,
        email || '',
        hashed,
        phone || '',
        role || 'user',
        location || '',
        emergencyContact || ''
      ], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, userId: result.insertId });
      });
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ User/Admin Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result[0];

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      // Update last login
      db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

      // ✅ Admin vs User redirect
      if(user.role === 'admin'){
          res.json({ success: true, userId: user.id, role: user.role, redirect: '/frontend/admin_dashboard.html' });
      } else {
          res.json({ success: true, userId: user.id, role: user.role, redirect: '/frontend/user.html' });
      }

    } catch (e) {
      res.status(500).json({ error: 'Error comparing passwords' });
    }
  });
});

module.exports = router;
