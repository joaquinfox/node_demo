// VARIABLE DECLARATION
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const Camp = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require('./routes/index');

// DATABASE
mongoose.connect('mongodb://localhost/yelp_9', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});


// PASSPORT CONFIGURATIOM
app.use(
  session({
    secret: 'hanga banga',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DEPENDENCIES
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT || 3000, function () {
  console.log('server up');
});
