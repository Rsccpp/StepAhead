// Load environment variables
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const signup = require('./models/signup');
const users = require('./models/users');


// Connect to MongoDB
main()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/StepAhead')
};


const viewRoutes = require('./src/routes/viewRoutes');

const PORT = process.env.PORT || 3000;


// Set up the view engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

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

// Landing page route
app.get('/', (req, res) => {
   res.render('pages/landing', { title: 'Welcome' });
});

// Profile page route
app.get('/pages/profile', (req, res) => {
   res.render('pages/profile', { title: 'Profile' });
});

// dashboard page route
app.get('/pages/dashboard', (req, res) => {
   res.render('pages/dashboard', { title: 'Dashboard' });
});

// Signup page route
app.get('/pages/signup', (req, res) => {
   res.render('pages/signup', { title: 'Signup', error: null });
});

// Login page route
app.get('/pages/login', (req, res) => {
   res.render('pages/login', { title: 'Login' });
}); 

// Resources page route
app.get('/pages/resources', (req, res) => {
   res.render('pages/resources', { title: 'Resources' });
});

// Recommendations page route
app.get('/pages/recommendations', (req, res) => {
   res.render('pages/recommendations', { title: 'Recommendations' });
});


// Roadmap page route
app.get('/pages/roadmap', (req, res) => {
   res.render('pages/roadmap', { title: 'Roadmap' });
});


// Handling users activity

// Signup route to handle user registration

app.post('/stepAhead/signup', async (req, res) => {
   try {
       console.log(req.body);
      const { email, password } = req.body;
      
      const newEmail = await signup.findOne({ email: email });

      if (newEmail) {
         return res.render('pages/signup', { 
        title: 'Signup',
        error: 'Email already exists! Please use another one.'
});

      } 

      const newUser = new signup({ email, password});

      await newUser.save();

      res.redirect('/pages/profile'), { title: 'Profile' };
   } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error');
   }
})

// 

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});