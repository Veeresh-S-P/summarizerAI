import express from 'express';
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors';
import { GoogleGenerativeAI } from '@Google Drive/generative-ai';
dotenv.config();
const app = express();
const port = process.env.PORT
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.use(cors());
app.use(express.json());
app.post('/generate-post', async (req, res) => {
  const { platform, topic } = req.body;
  if (!platform || !topic) {
    return res.status(400).json({ error: 'Platform and topic are required.' });
  }
  const allowedPlatforms = ['LinkedIn', 'Twitter', 'Instagram'];
  if (!allowedPlatforms.includes(platform)) {
    return res.status(400).json({ error: 'Invalid platform selected.' });
  }
  const prompt = `Write a professional ${platform} post for the topic: "${topic}". Keep it concise and engaging.`;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const post = response.text().trim();
    return res.json({ platform, post });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate post', details: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});