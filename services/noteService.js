var Datastore = require('nedb');
var db = new Datastore({ filename: './data/note.db', autoload: true });

function getNote(id, callback) {
    db.findOne({ _id: id }, function (err, note) {
        callback(err, note);
    });
}

function loadNotes(callback) {
    db.find({}, function (err, notes) {
        callback(err, notes);
    });
}

function addNote(note, callback) {
    db.insert(note, function(err, newNote){
        callback(err, newNote);
    });
}

function updateNote(id, note, callback) {
    db.update({_id: id}, note, {}, function (err) {
        getNote(id, callback);
    });
}

module.exports = {get : getNote, all : loadNotes, add : addNote, update: updateNote};