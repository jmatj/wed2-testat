var configService = require("../services/configService.js");

module.exports.updateConfigurations = function(req, res, query, callback) {
    loadConfigurations(req, res, function (req, res, config) {
        var sort = !!query.sort ? query.sort : 'duedate';
        var sortOrder = 1;
        var style = !!query.style ? query.style : 'light';

        //swap sort properties if query param is set and corresponds with the config value
        if (!!config['sort'] && !!query.sort && config['sort'].value === query.sort) {
            sortOrder = config['sort'].params.sortOrder == 1 ? -1 : 1;
        }
        if (!!config['style'] && !!query.style && config['style'].value === query.style) {
            style = config['style'].value == 'light' ? 'dark' : 'light';
        }
        //update config
        configService.set('sort', sort, {sortOrder: sortOrder}, function() {
            configService.set('style', style, {}, function() {
                loadConfigurations(req, res, callback);
            });
        });
    });
};

function loadConfigurations(req, res, callback) {
    configService.get(['sort', 'style'], function(err, config) {
        callback(req, res, config);
    });
}