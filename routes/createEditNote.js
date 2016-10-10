var express = require('express');
var router = express.Router();
var noteController = require('../controller/noteController.js');

router.get('/new', noteController.newNote);
router.get('/edit/:id', noteController.getNote);
router.post('/save', noteController.createNote);
router.post('/save/:id', noteController.updateNote);

module.exports = router;