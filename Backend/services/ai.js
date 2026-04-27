import config from "../config/config.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    GEMINI_API_KEY: config.GEMINI_API_KEY
});

async function AI({subject}) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 2 questions on ${subject} subject of the format with array of json objects , 
    each json object containing question, options array,correct option and difficulty level of 
    question,and subject`
  });
  console.log(response.text);
  return response.txt
}

export default AI;