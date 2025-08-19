
# EchoAudit

EchoAudit is a **voice-based form filling and logging platform** designed to streamline data entry through natural speech. Instead of manually typing records, users can speak naturally, and EchoAudit automatically extracts structured information such as patient details, issues, and recommended actions.

## 🚀 Features

* 🎙️ **Voice-to-Text Transcription**
  Converts audio input (e.g., `.wav`, `.mp3`, `.opus`) into text using speech recognition.

* 🧠 **Text Analysis Engine**
  Extracts structured data such as:

  * Bed number / patient ID
  * Issue/condition
  * Recommended action

* 📂 **Automated Logging**
  Stores extracted information in a database for auditing and future reference.

* 🔍 **Error Detection**
  Identifies missing information (e.g., if recommended action is not provided) and raises alerts.

* 🖥️ **Backend API**
  Built with **Node.js + Express**, providing endpoints for uploading voice files, processing text, and retrieving logs.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (or SQL, depending on your setup)
* **Speech Processing:** Whisper / Google Speech-to-Text / other engines
* **Regex-based Parsing:** Custom extraction logic for patient data
* **Frontend (Optional):** React / Any UI for displaying logs

---

## 📦 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Sahas2711/echoaudit.git
   cd echoaudit-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (`.env`):

   ```env
   PORT=5000
   DB_URI=mongodb://localhost:27017/echoaudit
   SPEECH_API_KEY=your_speech_to_text_api_key
   ```

4. Start the server:

   ```bash
   node server.js
   ```

---

## 🎯 Usage

### Upload Voice File

Send a POST request to process audio:

```http
POST /api/voice
Content-Type: multipart/form-data
File: voice.opus
```

**Response Example:**

```json
{
  "0": {
    "bed": 9,
    "issue": "low oxygen saturation",
    "recommended_action": "administer oxygen therapy"
  },
  "transcription": "Patient in bed nine has low oxygen saturation. Recommended action administer oxygen therapy."
}
```

---

## 📊 Log Management

* Logs are stored in the database with timestamps.
* Missing fields (e.g., no recommended action) are flagged for review.

---

## 🧩 Project Structure

```
EchoAudit-Backend/
│── server.js          # Entry point
│── routes/
│   ├── voice.js       # Voice upload & processing API
│   ├── logs.js        # Log retrieval & management
│── utils/
│   ├── speech.js      # Speech-to-text integration
│   ├── parser.js      # Regex-based text extraction
│── models/
│   ├── Log.js         # Database schema
│── uploads/           # Temporary audio storage
│── package.json
│── README.md
```

---

## 🔮 Future Enhancements

* ✅ Multi-language voice input
* ✅ Real-time streaming transcription
* ✅ Dashboard for log visualization
* ✅ Integration with hospital EMR systems

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

## 📜 License

MIT License.

---
