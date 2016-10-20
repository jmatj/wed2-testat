var Datastore = require('nedb');
var db = new Datastore({ filename: './data/config.db', autoload: true });

function getConfig(name, callback) {
    db.findOne({ name: name }, callback);
}

function setConfig(name, value, callback) {
    var config = {'name': name, 'value': value};
    db.update({'name': name}, config, {upsert: true}, function (err) {
        getConfig(name, callback);
    });
}

module.exports = {get : getConfig, set : setConfig};
