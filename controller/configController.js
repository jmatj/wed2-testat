var configService = require("../services/configService.js");

module.exports.updateConfigurations = function(req, res, query, callback) {
    loadConfigurations(req, res, function (req, res, config) {
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

        //only update if query param does not correspond with config value
        if (!!config['style'] && config['style'].value !== style) {
            hasChanges = true;
        }
        if (!!config['hide'] && config['hide'].value !== hide) {
            hasChanges = true;
        }

        //update config only on updates
        if (hasConfigurationsChanges(hasChanges, config, query)) {
            configService.set('sort', sort, {sortOrder: sortOrder}, function() {
                configService.set('style', style, {}, function() {
                    configService.set('hide', hide, {}, function() {
                        loadConfigurations(req, res, callback);
                    });
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
    configService.get(['sort', 'style', 'hide'], function(err, config) {
        callback(req, res, config);
    });
}

function hasConfigurationsChanges(hasChanges, config, query) {
    return hasChanges
        || (!!query.sort && query.sort !== config['sort'].value)
        || config['sort'] === undefined  //initial values should be set
        || config['style'] === undefined
        || config['hide'] === undefined;
}