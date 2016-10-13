var express = require('express');
var router = express.Router();
var noteController = require('../controller/noteController.js');

router.get('/new', noteController.newNote);
router.get('/edit/:id', noteController.getNote);
router.post('/new', noteController.createNote);
router.post('/edit/:id', noteController.updateNote);

module.exports = router;