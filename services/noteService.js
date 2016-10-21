var Datastore = require('nedb');
var db = new Datastore({ filename: './data/note.db', autoload: true });
var configService = require("../services/configService.js");

function getNote(id, callback) {
    db.findOne({ _id: id }, callback);
}

function loadNotes(sortBy, callback) {
    // TODO: Switch ascending / descending order
    configService.get('sort', function(err, config) {
        if (!!config) {
            if (!!sortBy) {
                // set new sortby
                configService.set('sort', sortBy, function(err, newSortBy) {
                    // swap ascending / descending
                    swapSortOrder(function(err, sort_order) {
                        loadSortedNotes(newSortBy.value,  sort_order.value, callback);
                    });
                });

            } else {
                // get config
                configService.get('sort', function(err, sortBy) {
                    configService.get('sort_order', function (err, sort_order) {
                        loadSortedNotes(sortBy.value, sort_order.value, callback);
                    });
                });

            }
        } else {
            if (!!sortBy) {
                // set config and order
                configService.set('sort', sortBy, function(err, newSortBy) {
                   configService.set('sort_order', 1, function(err, sort_order) {
                      loadSortedNotes(newSortBy.value, sort_order.value, callback);
                   });
                });
            } else {
                // load default
                db.find({}, callback);
            }
        }
    });
}

function swapSortOrder(callback) {
    configService.get('sort_order', function(err, config) {
        var newOrder;
        if (!config) {
            newOrder = 1;
        } else {
            newOrder = config.value == 1 ? -1 : 1;
        }
        configService.set('sort_order', newOrder, callback);
    });
}

function loadSortedNotes(sortBy, order, callback) {
    db.find({}).sort({ [sortBy]: order }).exec(callback);
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