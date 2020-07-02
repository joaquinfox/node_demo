const express = require('express');
const router = express.Router();
const Camp = require('../models/campground');

//  Index
router.get('/', (req, res) => {
  Camp.find({}, function (err, camps) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {
        campgrounds: camps,
      });
    }
  });
});

//  New
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

//  Create
router.post('/', isLoggedIn, (req, res) => {
  req.body.camp.description = req.sanitize(req.body.camp.description);

  let name = req.body.camp.name;
  let image = req.body.camp.image;
  let description = req.body.camp.description;
  let author = {
    id: req.user._id,
    username: req.user.username,
  };
  let newCamp = {
    name: name,
    image: image,
    description: description,
    author: author,
  };

  Camp.create(newCamp, function (err, camp) {
    console.log(camp);
    res.redirect('/campgrounds');
  });
});

//  Show
router.get('/:id', (req, res) => {
  const targetId = req.params.id;

  // Find the campground with the matching id.
  Camp.findById(targetId)
    .populate('comments')
    .exec(function (err, foundCamp) {
      res.render('campgrounds/show', { camp: foundCamp });
    });
});

// Edit
router.get('/:id/edit',hasCampgroundAuthority, (req, res) => {
  Camp.findById(req.params.id, function (err, foundCamp) {
    res.render('edit', { camp: foundCamp });
  });
});

// Update
router.put('/:id', hasCampgroundAuthority,(req, res) => {
  req.body.camp.description = req.sanitize(req.body.camp.description);
  Camp.findByIdAndUpdate(req.params.id, req.body.camp, function (
    err,
    foundCamp
  ) {
    res.redirect('/campgrounds/' + req.params.id);
  });
});

// Destroy
router.delete('/:id',hasCampgroundAuthority, (req, res) => {
  Camp.findByIdAndRemove(req.params.id, function (err) {
    res.redirect('/campgrounds');
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function hasCampgroundAuthority(req, res, next) {
  if (req.isAuthenticated()) {
    Camp.findById(req.params.id, (err, foundCamp) => {
      if (err) {
        console.log('ERROR', err.message || err);
        res.redirect('back');
      } else {
        if (foundCamp.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
