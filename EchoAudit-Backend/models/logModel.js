const db = require("../config/db");

const Log = {
  create: (bed_no, issue, recommended_action, transcript, callback) => {
    const sql = "INSERT INTO logs (bed_no, issue, recommended_action, transcript) VALUES (?, ?, ?, ?)";
    db.query(sql, [bed_no, issue, recommended_action, transcript], callback);
  }
};

module.exports = Log;
