var Datastore = require('nedb');
var db = new Datastore({ filename: './data/note.db', autoload: true });
var configService = require("../services/configService.js");

function getNote(id, callback) {
    db.findOne({ _id: id }, function (err, note) {
        callback(err, note);
    });
}

function loadNotes(sortBy, callback) {
    // TODO: Switch ascending / descending order
    if (!!sortBy) {
        configService.set('sort', sortBy, function(err, config) {
            loadSortedNotes(config.value, callback);
        });
    } else {
        configService.get('sort', function(err, config) {
            if (!!config) {
                loadSortedNotes(config.value, callback);
            } else {
                db.find({}, callback);
            }
        });
    }
}

function loadSortedNotes(sortBy, callback) {
    db.find({}).sort({ [sortBy]: -1 }).exec(callback);
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