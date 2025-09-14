const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",  // XAMPP default
  database: "sos_alert_db1"
});

db.connect(err => {
  if(err) console.error("Database connection failed:", err);
  else console.log("✅ MySQL connected...");
});

module.exports = db;
