require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {
  GoogleGenerativeAI,
} = require('@google/generative-ai');
const { get } = require('http');

const apiKey = process.env.GEMINI_API_KEY; // Make sure to set your API key
const genAI = new GoogleGenerativeAI(apiKey);

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("C:\Users\dwayn\Desktop\malume\public\index.html")); // Serve static files from the 'public' directory

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "greet the user and give 2 language options between isiZulu and English once the language is chosen strictly answer in that particular language.",
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const chatSession = model.startChat({
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
    history: [
      { role: "user", parts: [{ text: userMessage }] }
    ],
  });

  const result = await chatSession.sendMessage(userMessage);
  res.json({ response: result.response.text() });
});

app.listen(port, () => {
  console.log(`Chatbot server running at http://localhost:3000`);
});
