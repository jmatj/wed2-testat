var Datastore = require('nedb');
var db = new Datastore({ filename: './data/config.db', autoload: true });

function getConfig(uid, callback) {
    db.find({ 'uid': uid }, function(err, results) {
        var config = {};
        results.forEach((r) => {
            config[r.name] = {'name': r.name, 'value': r.value, 'params': r.params};
        });
        callback(err, config);
    });
}

function setConfig(uid, name, value, params, callback) {
    var config = {'uid': uid, 'name': name, 'value': value, 'params': params};
    db.update({'uid': uid, 'name': name}, config, {upsert: true}, function (err) {
        callback();
    });
}

module.exports = {get : getConfig, set : setConfig};
