const say = require('say');
function analyzeText(text) {
  const patientsMap = {};

  const patientRegex = /\b(?:patient in )?bed (\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve).*?(?:has|with|issue)\s+([^.]+)\.?/gi;
  const actionRegex = /\b(?:recommend(?:ed)?\s+)?action[: ]?\s*([^.]+)\.?/gi;

  const bedsOrder = [];
  let match;
  
  // Extract beds + issues
  while ((match = patientRegex.exec(text)) !== null) {
    const bed = normalizeBed(match[1]);
    if (!bed) continue;
    const issue = match[2]?.trim() || "";
    patientsMap[bed] = { bed, issue, recommended_action: "" };
    bedsOrder.push({ bed, index: match.index });
  }

  // No patients extracted
  if (Object.keys(patientsMap).length === 0) {
    playVoice("Bed number is missing");
    throw new Error("❌ No patient info extracted: Bed number missing");
  }

  // Extract actions and assign to closest previous bed
  while ((match = actionRegex.exec(text)) !== null) {
    const actionIndex = match.index;
    let closestBed = null;
    for (let i = bedsOrder.length - 1; i >= 0; i--) {
      if (bedsOrder[i].index < actionIndex) {
        closestBed = bedsOrder[i].bed;
        break;
      }
    }
    if (closestBed) {
      patientsMap[closestBed].recommended_action = match[1]?.trim() || "";
    }
  }

  // Validation
  for (const p of Object.values(patientsMap)) {
    if (!p.bed) console.log("bed");//playVoice("Bed number is  missing");
    if (!p.issue)console.log("issue"); playVoice(`Issue missing for bed ${p.bed}`);
    if (!p.recommended_action) console.log("action");playVoice(`Recommended action missing for bed ${p.bed}`);
  }

  return Object.values(patientsMap);
}


// Helper: convert "nine" → 9
function normalizeBed(raw) {
  const wordToNum = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12
  };
  raw = raw.toLowerCase().trim();
  return isNaN(raw) ? (wordToNum[raw] || null) : parseInt(raw);
}

function playVoice(message) {
  say.speak(message);
}

module.exports = { analyzeText,playVoice };
