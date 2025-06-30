const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const summarizeText = require('./summarizer');
const app = express()
app.use(express.json());
app.post('/summarize', async (req, res) => {
  const { text } = req.body;
  const summary = await summarizeText(text);
  res.json(summary);
});
app.listen(8080,()=>{
    console.log("Server Running on port 8080")
})