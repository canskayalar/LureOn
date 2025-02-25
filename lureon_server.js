// Lureon AI and Command Challenge Game

// Import necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config(); // Load .env variables

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: String,
  progress: Number,
  clues: [String]
});

const User = mongoose.model('User', userSchema);

// Initialize OpenAI with Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// AI Interaction Route
app.post('/api/ai', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150
    });
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'AI processing failed.', details: error.message });
  }
});

// Command Challenge Route
app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  // Simulate terminal command processing
  if (command === 'whoami') {
    res.json({ output: 'player1' });
  } else if (command === 'ls') {
    res.json({ output: 'clue1.txt clue2.txt hidden_folder' });
  } else if (command.startsWith('cat ')) {
    const file = command.split(' ')[1];
    if (file === 'clue1.txt') {
      res.json({ output: 'The key is hidden in plain sight.' });
    } else {
      res.json({ output: 'File not found.' });
    }
  } else {
    res.json({ output: 'Command not recognized.' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lureon game server running on port ${PORT}`);
});
