// This controller's job is to render the correct EJS page.

exports.getLandingPage = (req, res) => {
    res.render('pages/landing', {
        title: 'Welcome'
    });
}

exports.getProfilePage = (req, res) => {
    res.render('pages/profile', {
        title: 'Profile Input'
    });
};

exports.getRecommendationsPage = (req, res) => {
    res.render('pages/recommendations', {
        title: 'Career Recommendations'
    });
};

exports.getRoadmapPage = (req, res) => {
    res.render('pages/roadmap', {
        title: 'Skill Roadmap'
    });
};

exports.getResourcesPage = (req, res) => {
    res.render('pages/resources', {
        title: 'Resources & Scholarships'
    });
};

exports.getDashboardPage = (req, res) => {
    res.render('pages/dashboard', {
        title: 'Your Dashboard'
    });
};

exports.getLoginPage = (req, res) => {
    res.render('pages/login', {
        title: 'Login'
    });
};

exports.getSignupPage = (req, res) => {
    res.render('pages/signup', {
        title: 'Sign Up'
    });
}