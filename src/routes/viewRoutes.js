const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

// Each route corresponds to a screen in the wireframe

// 1. Landing Page
router.get('/', viewController.getLandingPage);

// 2. Profile Input Screen
router.get('/profile', viewController.getProfilePage);

// 3. Career Recommendation Screen
router.get('/recommendations', viewController.getRecommendationsPage);

// 4. Skill Roadmap Screen
router.get('/roadmap', viewController.getRoadmapPage);

// 5. Resources & Scholarships Screen
router.get('/resources', viewController.getResourcesPage);

// 6. Dashboard / Progress Tracker Screen
router.get('/dashboard', viewController.getDashboardPage);

// 7. Authentication Screens
router.get('/login', viewController.getLoginPage);
router.get('/signup', viewController.getSignupPage);

module.exports = router;