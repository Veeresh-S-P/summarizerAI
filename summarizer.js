const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function summarizeText(inputText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Summarize the following text into 3–5 concise bullet points. Return it as a JSON array like: [ "Point 1", "Point 2", "Point 3" ]. Only return raw JSON array, without markdown formatting or explanation. TEXT: ${inputText}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text().trim();
 
  if (text.startsWith("```")) {
    text = text.replace(/```json|```/g, "").trim();
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return { error: "Could not parse JSON", raw: text };
  }
}
module.exports = summarizeText;