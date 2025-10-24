// Load environment variables
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const signup = require("./models/signup");
const users = require("./models/users");
const multer = require("multer"); // for handling file uploads
const Roadmap = require('./models/roadmap');

// For deployment -- mongo DB connection string
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Connect to MongoDB
// main()
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/StepAhead");
// }

// Set storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads')); // folder where images will be saved
  },
   filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

const upload = multer({ storage: storage });

// for session management

const session = require("express-session");

app.use(
  session({
    secret: "yourSecretKey", // change this to any secret string
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // optional: 1 hour
  })
);


const viewRoutes = require("./src/routes/viewRoutes");

const PORT = process.env.PORT || 3000;

// Set up the view engine
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

// Middleware to serve static files (CSS, client-side JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Routes ---
// Use the view router for all page rendering

// for chatbot
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { error } = require("console");
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

app.post("/ask", async (req, res) => {
  // Get the question from the request body
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "A question is required." });
  }

  // Get the answer from the Gemini API
  const answer = await getGeminiResponse(question);

  // Send the answer back to the frontend
  res.json({ answer: answer });
});

// Landing page route
app.get("/", (req, res) => {
  res.render("pages/landing", { title: "Welcome" });
});

// Profile page route
app.get("/pages/profile", (req, res) => {
  res.render("pages/profile", { title: "Profile", error: null });
});

// dashboard page route
app.get("/pages/dashboard", (req, res) => {
  const profile = req.session.profile;

  if (!profile) {
    return res.redirect("/pages/profile"); // no profile yet
  }

  res.render("pages/dashboard", { title: "Dashboard", profile });
});

// Signup page route
app.get("/pages/signup", (req, res) => {
  res.render("pages/signup", { title: "Signup", error: null });
});

// Login page route
app.get("/pages/login", (req, res) => {
  res.render("pages/login", { title: "Login", error: null });
});

// Resources page route
app.get("/pages/resources", (req, res) => {
  res.render("pages/resources", { title: "Resources" });
});

// Recommendations page route
app.get("/pages/recommendations", (req, res) => {
  res.render("pages/recommendations", { title: "Recommendations" });
});

app.post("/pages/recommendations", (req, res) => {
   res.render("pages/recommendations", { title: "Recommendations" });
});


// Roadmap page route
app.get("/pages/roadmap", (req, res) => {
   // list of career options
  const roles = ["Data Scientist", "Web Developer", "AI Engineer"];
  res.render("pages/roadmap", { roles, roadmap: null, title: "Roadmap" });
});

app.post('/pages/roadmap', async (req, res) => {
  const { role } = req.body;

  // fetch roadmap from DB
  const roadmap = await Roadmap.findOne({ role });

  // render the same page with roadmap items
  const roles = ["Data Scientist", "Web Developer", "AI Engineer"];
  res.render('pages/roadmap', { roles, roadmap, title: "Roadmap" });
});

// Handling users activity

// Signup route to handle user registration

app.post("/pages/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const newEmail = await signup.findOne({ email: email });

    if (newEmail) {
      return res.render("pages/signup", {
        title: "Signup",
        error: "Email already exists! Please use another one.",
      });
    }

    const newUser = new signup({ email, password });

    await newUser.save();

    res.redirect("/pages/profile");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Signin route to handle user login
app.post("/pages/login", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const existingUser = await users.findOne({
      email: email,
      password: password,
    });

    if (!existingUser) {
      return res.render("pages/login", {
        title: "Login",
        error: "Invalid email or password. Please try again.",
      });
    }

    res.redirect("/pages/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Profile Inputs

app.post("/pages/profile", upload.single("avatarUrl"), async (req, res) => {
  try {
    console.log("File info:", req.file);
    console.log(req.body);
    const { name, education, skills, interests, location, email, password} = req.body;

    const newEmail = await users.findOne({ email: email });

    if (newEmail) {
      return res.render("pages/profile", {
        title: "Profile",
        error: "Email already exists! Please use another one.",
      });
    }

    // Store image URL
    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Create the profile object
    const newProfile = new users({
      name,
      education,
      skills: skills.split(",").map(s => s.trim()),
      interests: interests.split(",").map(i => i.trim()),
      location,
      avatarUrl,
      email,
      password
    });

    await newProfile.save();

    // Save in session to use after redirect
    req.session.profile = newProfile;

    res.redirect("/pages/dashboard");
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

