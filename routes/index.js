var express = require('express');
var router = express.Router();
var noteController = require('../controller/noteController.js');

router.get('/', noteController.loadNotes);

module.exports = router;