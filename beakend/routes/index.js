var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
    // res.redirect('/home');
});

/* GET home page. */
router.get('/privacy', function(req, res, next) {
  res.render('privacy', { title: 'Express' });
});

/* GET home page. */
router.get('/privacy', function(req, res, next) {
  res.render('privacy', { title: 'Express' });
});

module.exports = router;
