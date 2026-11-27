require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('HeadingOver engine is running.');
});

// Twilio inbound SMS webhook
app.post('/webhook/sms', async (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;

  console.log('Incoming SMS from', from, ':', body);

  // TODO: parse with Claude, create Google Calendar event, reply
  res.type('text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>Got it. Processing: ${body}</Message></Response>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HeadingOver engine listening on port ${PORT}`);
});
