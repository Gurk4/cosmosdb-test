var express = require('express');
var router = express.Router();
var promiseFamilyDocument = require('../controllers/userController').promiseFamilyDocument;

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  console.log('hit the users/id route');
  console.log(req.params.id);
  promiseFamilyDocument(req.params.id)
    .then(data => res.json(data))
    .catch(e => {res.status(500, {error: e}); res.sendStatus(500)});
  // res.json()
  // res.send('respond with a resource');
});

module.exports = router;
