var configService = require("../services/configService.js");

module.exports.updateConfigurations = function(req, res, query, callback) {
    loadConfigurations(req, res, function (req, res, config) {
        var sort = !!query.sort ? query.sort : 'duedate';
        var sortOrder = 1;
        var style = !!query.style ? query.style : 'light';
        var hasSwappingChanges = false;

        //swap sort properties if query param is set and corresponds with the config value
        if (!!config['sort'] && !!query.sort && config['sort'].value === query.sort) {
            sortOrder = config['sort'].params.sortOrder == 1 ? -1 : 1;
            hasSwappingChanges = true;
        }
        if (!!config['style'] && !!query.style) {
            style = config['style'].value == 'light' ? 'dark' : 'light';
            hasSwappingChanges = true;
        }
        //update config only on updates
        if (hasConfigurationsChanges(hasSwappingChanges, config, query)) {
            configService.set('sort', sort, {sortOrder: sortOrder}, function() {
                configService.set('style', style, {}, function() {
                    loadConfigurations(req, res, callback);
                });
            });
        } else {
            callback(req, res, config);
        }
    });
};

module.exports.getStyleConfig = function(callback) {
    configService.get(['style'], function(err, config) {
        callback(config['style']);
    });
};

function loadConfigurations(req, res, callback) {
    configService.get(['sort', 'style'], function(err, config) {
        callback(req, res, config);
    });
}

function hasConfigurationsChanges(hasSwappingChanges, config, query) {
    return hasSwappingChanges || (!!query.sort && query.sort !== config['sort']) || config['sort'] === undefined || config['style'] === undefined;
}