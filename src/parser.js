const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function parseJobText(text) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { raw: text, parsed: false, error: 'No Anthropic API key' };
  }

  const system = `You are a scheduling assistant for home-service businesses (cleaning, detailing, handyman, etc.).
Extract structured job information from the user's plain-language text.
Return ONLY valid JSON with these fields (use null if unknown):
{
  "customerName": string or null,
  "phone": string or null,
  "address": string or null,
  "serviceType": string or null,
  "startTime": ISO 8601 string or null,
  "durationMinutes": number or null,
  "notes": string or null,
  "intent": "book" | "reschedule" | "cancel" | "query" | "other"
}
If the date/time is relative (e.g. "Tuesday 3pm"), resolve it relative to today.
Today is ${new Date().toISOString().split('T')[0]}.`;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system,
      messages: [{ role: 'user', content: text }],
    });

    const raw = message.content[0]?.text || '{}';
    const parsed = JSON.parse(raw);
    return { raw: text, parsed: true, data: parsed };
  } catch (err) {
    console.error('Parser error:', err.message);
    return { raw: text, parsed: false, error: err.message };
  }
}

module.exports = { parseJobText };
