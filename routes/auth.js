const express = require('express')
const passport = require('passport')
const router = express.Router();
//@desc Auth with google
//@route GET /
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

//@desc  Google Auth Callback   
//@route GET /auth/google/callback 
router.get('/google/callback', 
passport.authenticate('google', { failureRedirect: '/' }), 
(req, res) => {
    res.redirect('/dashboard'); // redirect to dashboard if success
} 
);

//@desc Logout user
//@route GET /auth/logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        res.redirect('/');
    });
}
);

module.exports = router;