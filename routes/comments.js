const express = require('express');
const router = express.Router({ mergeParams: true });
const Camp = require('../models/campground');
const Comment = require('../models/comment');

router.get('/new', isLoggedIn, (req, res) => {
  Camp.findById(req.params.id, (err, camp) => {
    if (!err) {
      res.render('comments/new', { camp: camp });
    }
  });
});

router.post('/', isLoggedIn, (req, res) => {
  // lookup campground
  Camp.findById(req.params.id, (err, camp) => {
    if (!err) {
      Comment.create(req.body.comment, (err, comment) => {
        if (!err) {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          camp.comments.push(comment);
          camp.save();
          res.redirect('/campgrounds/' + camp._id);
        }
      });
    }
  });
});

// Edit
router.get('/:comment_id/edit', hasCommentAuthority,(req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      console.log('ERROR', err);
    } else {
      res.render('comments/edit', {
        comment: foundComment,
        camp: req.params.id,
      });
      console.log('ID', req.params.id, 'FOUNDCOMMENT', foundComment);
    }
  });
});

// Update
router.put('/:comment_id', hasCommentAuthority,(req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, foundComment) => {
      if (err) {
        console.log('ERROR', err);
      } else {
        res.redirect('/campgrounds/' + req.params.id);
      }
    }
  );
});

// Destroy
router.delete('/:comment_id',hasCommentAuthority, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      console.log('ERROR', err);
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
function hasCommentAuthority(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        console.log('ERROR', err);
        res.redirect('back');
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
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
