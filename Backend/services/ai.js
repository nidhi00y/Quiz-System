import config from "../config/config.js";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});


async function AI({
  subject,
  topic
}) {

  const response =
    await ai.models.generateContent({

      model: "gemini-3-flash-preview",

      contents: `

Generate EXACTLY 12 multiple-choice questions for the subject "${subject}" from the topic "${topic}".

Difficulty distribution MUST be:
- 4 easy
- 4 medium
- 4 hard

Return ONLY a valid JSON array.

Each item MUST strictly follow this schema:

{
  "questionText": string,
  "options": [string, string, string, string],
  "correctOption": number (0-3),
  "difficulty": "easy" | "medium" | "hard",
  "subject": "${subject}",
  "topic": "${topic}"
}

IMPORTANT RULES:
- No markdown
- No code fences
- No explanation text
- No trailing commas
- Options must be meaningful
- correctOption must be integer from 0 to 3
- Ensure conceptual variety
- Questions should belong ONLY to topic "${topic}"

`,
    });

  return response.text;
}

export default AI;