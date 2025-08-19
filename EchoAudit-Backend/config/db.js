const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",   
  user: "root",        // <-- change if your DB username is different
  password: "Pass@12345",        // <-- put your MySQL password here
  database: "echoaudit" // <-- your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

module.exports = db;
