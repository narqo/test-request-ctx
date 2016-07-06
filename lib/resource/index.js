'use strict';

var fs = require('fs');
var path = require('path');
var vow = require('vow');
var Resource = require('./resource');

function loadResource(name) {
    try {
        return vow.resolve(require(name));
    } catch (e) {
        throw vow.reject(e);
    }
}

module.exports = resourcesPath => {
    resourcesPath = path.resolve(resourcesPath);

    fs.readdirSync(resourcesPath).forEach(f => console.log(f));

    /**
     * @param {Context} [ctx]
     * @param {String} name
     * @param {*} [args]
     * @param {Object} [params]
     */
    return function resource(ctx, name, args, params) {
        if (typeof ctx === 'string') {
            params = opts;
            opts = name;
            name = ctx;
            ctx = null;
        }

        const [resourceName, method = 'get'] = name.split('.');

        return loadResource(path.join(resourcesPath, resourceName)).then(cls => {
            const r = new cls(ctx, Object.assign({ name: resourceName }, params));

            return r.invoke(method, args);
        });
    }
}

exports.Resource = Resource;
