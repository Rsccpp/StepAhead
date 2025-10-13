// Load environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');
const viewRoutes = require('./src/routes/viewRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware to serve static files (CSS, client-side JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Routes ---
// Use the view router for all page rendering


// for chatbot
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function getGeminiResponse(userQuestion) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(userQuestion);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I'm having trouble connecting to my brain right now.";
  }
}

app.post('/ask', async (req, res) => {
  // Get the question from the request body
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'A question is required.' });
  }

  // Get the answer from the Gemini API
  const answer = await getGeminiResponse(question);
  
  // Send the answer back to the frontend
  res.json({ answer: answer });
});

app.use('/', viewRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});