var moment = require('moment');
var noteService = require("../services/noteService.js");

module.exports.loadNotes = function(req, res, config) {
    noteService.all(config['sort'].value, config['sort'].params.sortOrder, config['hide'].value, function(err, notes, sortBy) {
        notes.forEach(function(note, index) {
            note.fromNow = moment(note.duedate).fromNow();
        });
        res.render('index',
            {
                notes: notes,
                sortBy: sortBy,
                hide: config['hide'].value,
                style: config['style'].value
            });
    });
};

module.exports.newNote = function(req, res) {
    res.render('createEditNote',
        {
            title: '',
            description: '',
            importance: 1,
            duedate: moment().format('YYYY-MM-DD')
        });
};

module.exports.getNote = function(req, res) {
    noteService.get(req.params.id, function(err, note) {
        note.duedate = moment(note.duedate).format('YYYY-MM-DD');
        res.render('createEditNote', note);
    });
};

module.exports.createNote = function(req, res) {
    if (!!req.body.cancel) {
        res.redirect('/');
        return;
    }
    var note = req.body;
    note.createdate = Date.now();
    req.body.duedate = moment(req.body.duedate).add(23, 'hours').add(59, 'minutes').format('YYYY-MM-DD HH:mm');
    noteService.add(req.body, function(err, note) {
        res.redirect('/');
    });
};

module.exports.updateNote = function(req, res) {
    if (!!req.body.cancel) {
        res.redirect('/');
        return;
    }
    req.body.duedate = moment(req.body.duedate).add(23, 'hours').add(59, 'minutes').format('YYYY-MM-DD HH:mm');
    noteService.update(req.params.id, req.body, function(err, note) {
        res.redirect('/');
    });
};
