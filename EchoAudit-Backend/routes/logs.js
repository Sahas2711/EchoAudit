const express = require("express");
const db = require("../config/db");
const router = express.Router();

router.post("/logs", (req, res) => {
  const { request, response } = req.body;

  const sql = "INSERT INTO logs (request, response) VALUES (?, ?)";
  db.query(sql, [request, response], (err, result) => {
    if (err) {
      console.error("Insert failed:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Log inserted", id: result.insertId });
  });
});
module.exports = router;
