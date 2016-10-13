var noteService = require("../services/noteService.js");

module.exports.loadNotes = function(req, res) {
    noteService.all(function(err, notes) {
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
            importance: 0,
            dueDate: new Date()
        });
};

module.exports.getNote = function(req, res) {
    noteService.get(req.params.id, function(err, note) {
        res.render('createEditNote', note);
    });
};

module.exports.createNote = function(req, res) {
    noteService.add(req.body, function(err, note) {
        res.redirect('/');
    });
};

module.exports.updateNote = function(req, res) {
    noteService.update(req.params.id, req.body, function(err, note) {
        res.render('createEditNote', note);
    });
};