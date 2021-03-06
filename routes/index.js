const express = require('express');
const router  = express.Router();

// authentication middleware
const { ensureAuthenticated } = require('../config/auth');

// index route
router.get('/', (req,res) => res.render('index', {layout: 'landing'}));

// dashboard page 
router.get('/dashboard', ensureAuthenticated, (req,res) => {
    res.render('dashboard', {
        name:            req.user.firstName,
        isAdmin:         req.user.isAdmin,
        isMember:        req.user.isMember,
        isAuthenticated: req.isAuthenticated(),
    });
});

module.exports = router;