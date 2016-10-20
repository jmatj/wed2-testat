var moment = require('moment');
var noteService = require("../services/noteService.js");

module.exports.loadNotes = function(req, res) {
    noteService.all(req.query.sort, function(err, notes) {
        notes.forEach(function(note, index) {
            note.fromNow = moment(note.duedate).fromNow();
        });
        res.render('index',
            {
                title: 'notely',
                notes: notes
            });
    });
};

module.exports.newNote = function(req, res) {
    res.render('createEditNote',
        {
            title: '',
            description: '',
            importance: 1,
            dueDate: moment().format('YYYY-MM-DD')
        });
};

module.exports.getNote = function(req, res) {
    noteService.get(req.params.id, function(err, note) {
        res.render('createEditNote', note);
    });
};

module.exports.createNote = function(req, res) {
    var note = req.body;
    note.createDate = Date.now();
    note.finishDate = null;
    noteService.add(req.body, function(err, note) {
        res.redirect('/');
    });
};

module.exports.updateNote = function(req, res) {
    noteService.update(req.params.id, req.body, function(err, note) {
        res.redirect('/');
    });
};