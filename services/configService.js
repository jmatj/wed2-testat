var Datastore = require('nedb');
var db = new Datastore({ filename: './data/config.db', autoload: true });

function prepareConfigArray(configurations) {
    var configurationArray = [];
    configurations.forEach(function(config, index) {
        configurationArray.push({name: config});
    });
    return configurationArray;
}

function getConfig(configurations, callback) {
    db.find({ $or: prepareConfigArray(configurations) }, function (err, configs) {
        var lookup = {};
        for (var i = 0, len = configs.length; i < len; i++) {
            lookup[configs[i].name] = configs[i];
        }
        callback(err, lookup);
    });
}

function setConfig(name, value, params, callback) {
    var config = {'name': name, 'value': value, 'params': params};
    db.update({'name': name}, config, {upsert: true}, function (err) {
        callback();
    });
}

module.exports = {get : getConfig, set : setConfig};
