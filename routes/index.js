const express = require('express');
const router  = express.Router();

/* GET Login page. */
router.get('/', (req, res, next) => {
  res.render('login');
});

module.exports = router;
