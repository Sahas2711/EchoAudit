function norm(s) {
  return (s || '').toLowerCase();
}

async function analyzeText(text) {
  const t = norm(text);

  // Extract "Bed <number>"
  const bedMatch = t.match(/\bbed\s*\d+\b/);
  const patientId = bedMatch ? bedMatch[0].replace(/\s+/, ' ').replace(/^./, c => c.toUpperCase()) : 'Unknown';

  // Detect a couple of common issues
  let issue = 'Not detected';
  let recommendedAction = 'Not detected';

  if (/oxygen|spo2|saturation/.test(t)) {
    issue = 'Possible low oxygen saturation';
    recommendedAction = 'Check SpO₂ and escalate if < 92%';
  } else if (/blood\s*pressure|bp/.test(t)) {
    if (/missing|not\s*taken|pending|no\s*reading/.test(t)) {
      issue = 'Missing blood pressure reading';
      recommendedAction = 'Take BP immediately and record';
    } else if (/high|elevated/.test(t)) {
      issue = 'Elevated blood pressure';
      recommendedAction = 'Recheck in 5 minutes; follow protocol';
    }
  } else if (/fever|temperature/.test(t)) {
    issue = 'Fever/temperature noted';
    recommendedAction = 'Administer antipyretics per protocol; monitor';
  }

  // Basic priority
  const priority = (/immediate|urgent|critical|low oxygen|spo2\s*<\s*92/.test(t)) ? 'High' : 'Normal';

  return { patientId, issue, recommendedAction, priority };
}

module.exports = { analyzeText };
