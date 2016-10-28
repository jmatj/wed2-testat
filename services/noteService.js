var Datastore = require('nedb');
var db = new Datastore({ filename: './data/note.db', autoload: true });

function getNote(id, callback) {
    db.findOne({ _id: id }, callback);
}

function loadNotes(sort, sortOrder, hide, callback) {
    var findQuery = {};
    if (hide === 'true') {
        findQuery = {$not: { done: 'on' }}
    }
    db.find(findQuery).sort({ [sort]: sortOrder }).exec(function(err, notes) {
        callback(err, notes, sort);
    });
}

function addNote(note, callback) {
    db.insert(note, callback);
}

function updateNote(id, note, callback) {
    db.update({_id: id}, note, {}, function (err) {
        getNote(id, callback);
    });
}

module.exports = {get : getNote, all : loadNotes, add : addNote, update: updateNote};