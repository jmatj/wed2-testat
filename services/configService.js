var Datastore = require('nedb');
var db = new Datastore({ filename: './data/config.db', autoload: true });

function getConfig(name, callback) {
    db.findOne({ name: name }, function (err, config) {
        callback(err, config);
    });
}

function addConfig(name, value, callback) {
    var config = {'name': name, 'value': value};
    db.insert(config, function(err, newConfig){
        callback(err, newConfig);
    });
}

function updateConfig(name, value, callback) {
    var config = {'name': name, 'value': value};
    db.update({'name': name}, config, {}, function (err) {
        getConfig(name, callback);
    });
}

module.exports = {get : getConfig, add : addConfig, update: updateConfig};
