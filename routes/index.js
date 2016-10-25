var express = require('express');
var router = express.Router();
var noteController = require('../controller/noteController.js');
var configController = require('../controller/configController.js');

router.get('/', function(req, res) {
    configController.updateConfigurations(req, res, req.query, noteController.loadNotes);
});

module.exports = router;