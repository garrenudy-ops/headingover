const { parseJobText } = require('../../src/parser');
const { createEvent } = require('../../src/calendar');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const params = new URLSearchParams(event.body || '');
  const from = params.get('From') || '';
  const body = params.get('Body') || '';

  console.log('Incoming SMS from', from, ':', body);

  const parsed = await parseJobText(body);

  let reply = `Got it. You said: ${body}`;

  if (parsed.parsed && parsed.data) {
    const job = parsed.data;
    reply = `Got it. ${job.customerName || 'Job'} · ${job.serviceType || 'service'}`;
    if (job.startTime) {
      reply += ` on ${new Date(job.startTime).toLocaleString('en-US', { timeZone: 'America/Denver' })}`;
    }
    reply += '.';

    if (job.intent === 'book' && job.startTime) {
      const cal = await createEvent(job);
      if (cal.success) {
        reply += ' Added to your calendar.';
      }
    }
  } else if (parsed.error) {
    reply = `I heard you, but I'm still setting up the full parser. You said: ${body}`;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/xml' },
    body: `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${reply}</Message></Response>`
  };
};
