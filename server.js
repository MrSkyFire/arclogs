const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_FILE = path.join(__dirname, 'logs.txt');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// GET logs
app.get('/logs.txt', (req, res) => {
  res.sendFile(LOG_FILE, err => {
    if (err) res.status(500).send('Could not read logs.');
  });
});

// POST submission
app.post('/submit', (req, res) => {
  const { username, date, text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Log text required." });

  let entry = '';
  if (username) entry += `@${username}\n`;
  if (date) entry += `[DATE: ${date}]\n`;
  entry += text.trim() + '\n---\n';

  fs.appendFile(LOG_FILE, entry, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to write log." });
    }
    return res.status(200).json({ success: true, entry });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
