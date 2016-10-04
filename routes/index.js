var express = require('express');
var hbs = require('hbs');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', 
      { 
        title: 'notely',
        notes: 
                [
                  {
                    id: 1,
                    done: true,
                    description: 'einkaufen gehen'
                  },
                  {
                    id: 2,
                    done: false,
                    description: 'Vorlesungen besuchen'
                  }
                ]
      });
});

module.exports = router;
