const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');  
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// Routes
const voiceRoutes = require('./routes/voice');
const logsRoutes = require('./routes/logs');

app.use('/api/voice', voiceRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/tts', require('./routes/ttsRoutes'));

app.get('/', (req, res) => {
  res.send('EchoAudit backend (offline) running...');
});

// Error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
