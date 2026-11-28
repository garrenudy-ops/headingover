exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const params = new URLSearchParams(event.body || '');
  const from = params.get('From') || '';
  const body = params.get('Body') || '';

  console.log('Incoming SMS from', from, ':', body);

  const reply = `Got it. You said: ${body}`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/xml' },
    body: `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${reply}</Message></Response>`
  };
};
