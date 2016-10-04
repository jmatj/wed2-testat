var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.baseUrl === '/create') {
        res.render('createEditNote',
            {
                id: 0,
                title: '',
                description: '',
                importance: 0,
                dueDate: '',
                editMode: false
            });
    } else if (req.baseUrl.indexOf("/edit") === 0) {
        res.render('createEditNote',
            {
                id: 123,
                title: 'Milch kaufen',
                description: '5 Liter Milch kaufen',
                importance: 3,
                dueDate: '15.10.16',
                editMode: true
            });
    }
});

module.exports = router;