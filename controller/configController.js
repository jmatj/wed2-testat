var configService = require("../services/configService.js");

module.exports.updateConfigurations = function(req, res, query, callback) {
    var uid = req.sessionID;

    loadConfigurations(req, res, uid, function (req, res, config) {
        var hasChanges = false;
        var sort = !!query.sort ? query.sort : !!config['sort'] ? config['sort'].value : 'duedate';
        var sortOrder = 1;
        var style = !!query.style ? query.style : !!config['style'] ? config['style'].value : 'light';
        var hide = !!query.hide ? query.hide : !!config['hide'] ? config['hide'].value : 'false';

        //swap sort properties if query param is set and corresponds with the config value
        if (!!config['sort'] && !!query.sort && config['sort'].value === query.sort) {
            sortOrder = config['sort'].params.sortOrder == 1 ? -1 : 1;
            hasChanges = true;
        }

        if (!!config['sort'] && config['sort'].value !== sort) {
            hasChanges = true;
        }

        if (!!config['style'] && config['style'].value !== style) {
            hasChanges = true;
        }
        if (!!config['hide'] && config['hide'].value !== hide) {
            hasChanges = true;
        }

        //update config only on updates
        if (hasConfigurationsChanges(hasChanges, config, query)) {
            configService.set(uid, 'sort', sort, {sortOrder: sortOrder}, function() {
                configService.set(uid, 'style', style, {}, function() {
                    configService.set(uid, 'hide', hide, {}, function() {
                        loadConfigurations(req, res, uid, callback);
                    });
                });
            });
        } else {
            callback(req, res, config);
        }
    });
};

module.exports.getStyleConfig = function(req, callback) {
    if (!!req.query.style) {
        callback(req.query.style);
    } else {
        configService.get(req.sessionID, 'style', function (err, config) {
            var style = !!config ? config.value : 'light';
            callback(style);
        });
    }
};

function loadConfigurations(req, res, uid, callback) {
    configService.getAll(uid, function(err, config) {
        callback(req, res, config);
    });
}

function hasConfigurationsChanges(hasChanges, config) {
    return hasChanges
        || config['sort'] === undefined  //initial values should be set
        || config['style'] === undefined
        || config['hide'] === undefined;
}