import config from "../config/config.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

async function AI({ subject }) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate exactly 5 multiple-choice questions for the subject "${subject}".
Return ONLY a valid JSON array.
Each item must follow this schema exactly:
{
  "questionText": string,
  "options": [string, string, string, string],
  "correctOption": number (0-3),
  "difficulty": "easy" | "medium" | "hard",
  "subject": "${subject}"
}
Do not include markdown, code fences, explanation text, or trailing commas.`,
  });

  return response.text;
}

export default AI;