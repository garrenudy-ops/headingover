// AI parser placeholder
// Will use Claude to turn plain-language text into structured job data:
// { customerName, address, startTime, duration, serviceType, phone, notes }

async function parseJobText(text) {
  // TODO: call Claude API
  return {
    raw: text,
    parsed: false
  };
}

module.exports = { parseJobText };
