const { google } = require('googleapis');

function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://headingover.com/oauth/callback'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

async function createEvent(job) {
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    return { success: false, error: 'No Google Calendar credentials' };
  }

  const calendar = getCalendarClient();
  const start = job.startTime ? new Date(job.startTime) : new Date();
  const end = new Date(start.getTime() + (job.durationMinutes || 60) * 60000);

  const event = {
    summary: `${job.customerName || 'Job'} · ${job.serviceType || 'Service'}`,
    description: [
      job.notes,
      job.phone ? `Phone: ${job.phone}` : null,
      job.address ? `Address: ${job.address}` : null,
    ].filter(Boolean).join('\n'),
    location: job.address || undefined,
    start: { dateTime: start.toISOString(), timeZone: 'America/Denver' },
    end: { dateTime: end.toISOString(), timeZone: 'America/Denver' },
  };

  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    return { success: true, eventId: res.data.id, link: res.data.htmlLink };
  } catch (err) {
    console.error('Calendar error:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { createEvent };
