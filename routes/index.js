const express = require('express');
const router = express.Router( );
const passport = require('passport');
const User = require('../models/user');
// AUTHORIZATION ROUTES
router.get('/', (req, res) => {
  res.render('landing');
});

router.get('/register', (req, res) => {
  res.render('auth/register');
});

router.post('/register', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        return res.render('auth/register');
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect('/campgrounds');
      });
    }
  );
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  (req, res) => {}
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
module.exports = router;
