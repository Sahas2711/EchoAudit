const Log = require('../models/logModel');

exports.saveLog = (req, res) => {
  const { request, response } = req.body;

  Log.create(request, response, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database insert failed' });
    }
    console.log("log created successfully");
    res.json({
      success: true,
      savedId: result.insertId,
      response
    });
  });
};
